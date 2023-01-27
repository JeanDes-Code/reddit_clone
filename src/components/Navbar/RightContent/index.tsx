import React from 'react';
import { Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import AuthButtons from './AuthButtons';
import AuthModal from './../../Modal/Auth/index';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
};
export default RightContent;
