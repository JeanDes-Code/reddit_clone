import type { NextPage } from 'next';
import PageContent from '@/components/Layout/PageContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { useEffect, useState } from 'react';
import {
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  where,
} from 'firebase/firestore';
import usePosts from '@/hooks/usePosts';
import { Post } from '@/atoms/postsAtom';
import PostLoader from '@/components/Posts/PostLoader';
import { Stack } from '@chakra-ui/react';
import PostItem from '@/components/Posts/PostItem';
import CreatePostLink from '@/components/Community/CreatePostLink';
import useCommunityData from '@/hooks/useCommunityData';
import { defaultCommunity, communityState } from '@/atoms/communitiesAtom';
import { useSetRecoilState } from 'recoil';

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
  const { communityStateValue } = useCommunityData();
  const setCommunityStateValue = useSetRecoilState(communityState);
  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId,
        );
        const postQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', myCommunityIds),
          limit(10),
        );
        const postDocs = await getDocs(postQuery);

        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error: any) {
      console.log('buildUserHomeFeed error: ', error);
    } finally {
      setLoading(false);
    }
  };

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
    if (communityStateValue.snippetsFetched) {
      buildUserHomeFeed();
    }
  }, [communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) {
      buildNoUserHomeFeed();
    }
  }, [user, loadingUser]);

  useEffect(() => {
    if (communityStateValue.currentCommunity.id) {
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: defaultCommunity,
      }));
    }
  }, [communityStateValue.currentCommunity.id]);

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
