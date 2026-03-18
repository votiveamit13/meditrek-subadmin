import { Box, List } from '@mui/material';
import NavGroup from './NavGroup';
import NavItem from './NavItem';
import menuItem from 'menu-items';
import { APP_PREFIX_PATH } from 'config.js'; // Ensure this is correct
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupIcon from '@mui/icons-material/Group';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';
import CategoryIcon from '@mui/icons-material/Category';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DifferenceIcon from '@mui/icons-material/Difference';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import BroadcastOnHomeIcon from '@mui/icons-material/BroadcastOnHome';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SummarizeIcon from '@mui/icons-material/Summarize';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  StarPurple500Icon: StarPurple500Icon,
  CategoryIcon: CategoryIcon,
  GroupIcon: GroupIcon,
  DifferenceIcon: DifferenceIcon,
  PhotoLibraryIcon: PhotoLibraryIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  ContactPhoneIcon: ContactPhoneIcon,
  BroadcastOnHomeIcon: BroadcastOnHomeIcon,
  BackupTableIcon: BackupTableIcon,
  AutoGraphIcon: AutoGraphIcon,
  PersonRemoveIcon: PersonRemoveIcon,
  CollectionsBookmarkIcon: CollectionsBookmarkIcon,
  VerifiedUserIcon: VerifiedUserIcon,
  SummarizeIcon: SummarizeIcon,
}; // adjust this import as needed
import {Typography} from '@mui/material';

console.log(List, NavItem, APP_PREFIX_PATH, icons)
const MenuList = () => {
  const navItems = menuItem.items.map((item) => {
    if (item.type === 'group') return <NavGroup key={item.id} item={item} />;
    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        Menu Items Error
      </Typography>
    );
  });

  // const bottomNavItems = [
  //   {
  //     id: 'manageFaq',
  //     title: 'Manage Faq',
  //     type: 'item',
  //     icon: icons['SummarizeIcon'],
  //     url: APP_PREFIX_PATH + '/manage-faq'
  //   },
  //   {
  //     id: 'manageContactUs',
  //     title: 'Manage Help & Support',
  //     type: 'item',
  //     icon: icons['ContactPhoneIcon'],
  //     url: APP_PREFIX_PATH + '/manage-contact-us'
  //   }
  // ];

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ paddingBottom: '80px' }}>
        {navItems}
      </Box>

      {/* <Box sx={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', pt: 1, pb: 1 }}>
        <List>
          {bottomNavItems.map((item) => (
            <NavItem key={item.id} item={item} level={1} />
          ))}
        </List>
      </Box> */}
    </Box>
  );
};

export default MenuList;
