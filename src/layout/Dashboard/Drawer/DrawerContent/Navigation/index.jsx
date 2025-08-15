// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// import { useContext } from 'react';
// import { MyContext } from '../../../../../context';

import useAuth from '../../../../../hooks/useAuth.js'

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// import { FileTextOutlined } from '@ant-design/icons';

//test dinamic menu and items
// import menuItemsTwo from 'menu-itemsTwo'


// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {

//   const {data} = useContext(MyContext)
const { user, menu } = useAuth(); // ✅ Get user and menu
console.log(useAuth())
console.log("El menu deberia mostrarse debajo")
console.log(menu)

  // Crear todos los grupos de navegación
  const navGroups = menu.map((item) => {
    const group = {
      id: item.id || Math.random().toString(), // asegurarse de tener un key único
      title: item.title,
      type: 'group',
      children: item.children,
    };

    switch (group.type) {
      case 'group':
        return <NavGroup key={group.id} item={group} />;
      default:
        return (
          <Typography key={group.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box>{navGroups}</Box>;
}


















//   data.menu.forEach((item,index,array)=>{
//     let nuevoArray = {
//   items: [
//     {
//     id: '',
//     title: item.title,
//     type: 'group',
//     children : item.children}
//   ]
// }


// const navGroups = nuevoArray.items.map((item) => {
//     switch (item.type) {
//       case 'group':
//         return <NavGroup key={item.id} item={item} />;
//       default:
//         return (
//           <Typography key={item.id} variant="h6" color="error" align="center">
//             Fix - Navigation Group
//           </Typography>
//         );
//     }
//   });

  



//   })

// //   let nuevoArray = {
// //   items: [
// //     {
// //     id: 'test2',
// //     title: 'a',
// //     type: 'group',
// //     children : data.menu[2].children}
// //   ]
// // }
  
// }
