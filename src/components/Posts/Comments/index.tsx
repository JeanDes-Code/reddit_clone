/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { Post, postState } from '@/atoms/postsAtom';
import { User } from 'firebase/auth';
import {
  Box,
  Flex,
  Text,
  SkeletonCircle,
  Stack,
  SkeletonText,
} from '@chakra-ui/react';
import CommentInput from './CommentInput';
import {
  Timestamp,
  writeBatch,
  collection,
  serverTimestamp,
  doc,
  increment,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import CommentItem, { Comment } from './CommentItem';
import { authModalState } from '@/atoms/authModalAtom';

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentFetchLoading, setCommentFetchLoading] = useState(true);
  const [commentCreateLoading, setCommentCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async () => {
    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    setCommentCreateLoading(true);

    try {
      const batch = writeBatch(firestore);

      // create comment document
      const commentDocRef = doc(collection(firestore, 'comments'));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split('@')[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: comment,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      newComment.createdAt = {
        seconds: Date.now() / 1000,
      } as Timestamp;
      // update the post.numberOfComments
      const postDocRef = doc(firestore, 'posts', selectedPost?.id as string);

      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // update client recoil state
      setComment('');
      setComments((prev) => [newComment, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));

      setCommentCreateLoading(false);
    } catch (error: any) {
      console.log('onCreateComment error', error);
    }
  };

  const onDeleteComment = async (comment: Comment) => {
    setDeleteLoading(true);
    try {
      const batch = writeBatch(firestore);
      // delete comment document
      const commentDocRef = doc(firestore, 'comments', comment.id as string);
      batch.delete(commentDocRef);
      // update the post.numberOfComments
      const postDocRef = doc(firestore, 'posts', selectedPost?.id as string);

      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // update client recoil state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));
    } catch (error: any) {
      console.log('onDeleteComment error', error);
    }
  };

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, 'comments'),
        where('postId', '==', selectedPost?.id),
        orderBy('createdAt', 'desc'),
      );

      const commentDocs = await getDocs(commentsQuery);

      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log('getPostComments error', error);
    }
    setCommentFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  return (
    <Box bg="white" borderRadius="0 0 4px 4px" p={2}>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!commentFetchLoading && (
          <CommentInput
            comment={comment}
            setComment={setComment}
            onCreateComment={onCreateComment}
            loading={commentCreateLoading}
            user={user}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {commentFetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No comments yet
                </Text>
              </Flex>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDeleteComment={onDeleteComment}
                  loadingDelete={false}
                  userId={user.uid}
                />
              ))
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
