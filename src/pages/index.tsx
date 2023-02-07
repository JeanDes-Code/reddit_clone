import type { NextPage } from 'next';
import PageContent from '@/components/Layout/PageContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { useEffect, useState } from 'react';
import { query, collection, orderBy, limit, getDocs } from 'firebase/firestore';
import usePosts from '@/hooks/usePosts';
import { Post } from '@/atoms/postsAtom';
import PostLoader from '@/components/Posts/PostLoader';
import { Stack } from '@chakra-ui/react';
import PostItem from '@/components/Posts/PostItem';
import CreatePostLink from '@/components/Community/CreatePostLink';

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();

  const buildUserHomeFeed = () => {};

  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10),
      );

      const postDocs = await getDocs(postQuery);

      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev: any) => ({
        ...prev,
        posts: posts as Post[],
      }));

      //setPostState
    } catch (error: any) {
      console.log('buildNoUserHomeFeed error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserPostVotes = () => {};

  //useEffects
  useEffect(() => {
    if (!user && !loadingUser) {
      buildNoUserHomeFeed();
    }
  }, [user, loadingUser]);
  console.log('postStateValue', postStateValue);
  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post: any) => (
              <PostItem
                key={post.id}
                post={post}
                onVote={onVote}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id,
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <>Recommendations </>
    </PageContent>
  );
};

export default Home;
