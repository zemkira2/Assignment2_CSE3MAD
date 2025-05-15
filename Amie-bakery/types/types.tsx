// types.ts
export interface MenuItem {
 id: string;
 name: string;
 price: number;
 image: any; // Use `ImageSourcePropType` if you import it from 'react-native'
}