import { Flex, Image } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import RightContent from './RightContent';
import SearchInput from './SearchInput';
import { auth } from '@/firebase/clientApp';

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Flex bg="white" height="44px" padding="6px 12px">
      <Flex align="center">
        <Image
          src="/images/redditFace.svg"
          alt="reddit logo face"
          height="30px"
        />
        <Image
          src="/images/redditText.svg"
          alt="reddit logo text"
          height="46px"
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      <SearchInput />
      {/* <Directory /> */}
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
