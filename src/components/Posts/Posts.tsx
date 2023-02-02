import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

import { Community } from '@/atoms/communitiesAtom';
import { firestore, auth } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { Post } from '@/atoms/postsAtom';
import PostItem from './PostItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Stack } from '@chakra-ui/react';
import PostLoader from './PostLoader';

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  //useAuthState
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();

  const getPosts = async () => {
    try {
      setLoading(true);
      //get posts for this community
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData.id),
        orderBy('createdAt', 'desc'),
      );

      const postDocs = await getDocs(postsQuery);

      //store in post state
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }));
    } catch (error: any) {
      console.log('getPosts error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post, index) => (
            <PostItem
              key={index}
              post={post}
              userIsCreator={user?.uid === post.creatorId}
              userVoteValue={undefined}
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
