import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import AuthButtons from './AuthButtons';
import AuthModal from './../../Modal/Auth/index';
import { auth } from '@/firebase/clientApp';

type RightContentProps = {
  user: any;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? (
          <Button onClick={() => signOut(auth)}>Log Out</Button>
        ) : (
          <AuthButtons />
        )}
      </Flex>
    </>
  );
};
export default RightContent;
