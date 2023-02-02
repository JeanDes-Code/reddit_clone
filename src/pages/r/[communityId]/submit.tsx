import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import PageContent from '@/components/Layout/PageContent';
import { Box, Text } from '@chakra-ui/react';
import NewPostForm from '@/components/Posts/PostForm/NewPostForm';
import { auth } from '@/firebase/clientApp';
import { useRecoilValue } from 'recoil';
import { communityState } from '@/atoms/communitiesAtom';

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);

  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a Post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <></>
    </PageContent>
  );
};
export default SubmitPostPage;
