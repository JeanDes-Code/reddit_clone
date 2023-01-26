import { Flex, Image } from '@chakra-ui/react';
import RightContent from './RightContent';
import SearchInput from './SearchInput';

const Navbar = () => {
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
      <RightContent />
    </Flex>
  );
};
export default Navbar;
