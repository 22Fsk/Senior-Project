import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { ScrollView, TextInput } from 'react-native';
import Categories from '../../components/categories';
import { apiCall } from '../../api';

const HomeScreen = () => {
    const {top} = useSafeAreaInsets();
    const paddingTop = top>0? top+10: 30;
    const [serach, setSearch] = useState('');
    const [images, setImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const searchInputRef = useRef(null);

    useEffect(()=>{
        fetchImages();
    },[]);

    const fetchImages = async (params={page: 1}, append=true)=>{
        let res = await apiCall(params);
        if(res.success && res?.data?.hits){
            if(append)
                setImages([...images, ...res.data.hits])
            else
            setImages([...res.data.hits])
        }
    }

    const handleChangeCategory = (cat)=>{
        setActiveCategory(cat);
    }

  return (
    <View style={[styles.container, {paddingTop}]}>
      {/** header */}
      <View style={styles.header}>
        <Pressable>
            <Text style={styles.title}>
                Pixels
            </Text>
        </Pressable>
        <Pressable>
            <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{gap: 15}}>
        {/** search bar */}
        <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
                <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
            </View>
            <TextInput 
            placeholder='Search for photos...' 
            value={serach}
            ref={searchInputRef}
            onChangeText={value=> setSearch(value)}
            style={styles.searchInput} />
            {
                serach && (
                    <Pressable style={styles.closeIcon}>
                        <Ionicons name="close" size={24} color={theme.colors.neutral(0.6)}/>
                    </Pressable>  
                )
            }

            
        </View>
        {/** categories */}
        <View style={styles.categories}>
            <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory}/>
        </View>

        {/** images grid*/}
        <View>
            {
                images.length>0 && <ImageGrid images={images}/>
            }
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        gap: 15
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.9),
    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        padding: 6,
        paddingLeft: 10,
        borderRadius: theme.radius.lg,
    },
    searchIcon: {
        padding: 8,
    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.sm,
        paddingVertical: 10,
        fontSize: hp(4),
    },
    closeIcon:{
        backgroundColor: theme.colors.neutral(0.1),
        padding:8,
        borderRadius: theme.radius.sm
    }
})