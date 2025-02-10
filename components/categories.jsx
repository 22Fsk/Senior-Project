import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'
import { data } from '../constants/data'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common';

const categories = ({activeCategory, handleChangeCategory}) => {
  return (
    <FlatList
        horizontal
        contentContainerStyle={styles.flatlistcontainer}
        showsHorizontalScrollIndicator={false}
        data={data.categories}
        keyExtractor={item=>item}
        renderItem={({item, index})=>(
            <CategoryItem
                isActive={activeCategory==item}
                handleChangeCategory={handleChangeCategory}
                title={item}
                index={index}
            />
        )} 
    />
  )
}

const CategoryItem = ({title, index, isActive, handleChangeCategory})=>{
    let color = isActive ? theme.colors.white: theme.colors.neutral(0.8);
    let backgroundColor = isActive ? theme.colors.neutral(0.8) : theme.colors.white;
    return(
        <View>
            <Pressable 
            onPress={()=> handleChangeCategory(isActive? null : title)} 
            style={[styles.category, {backgroundColor}]}>
                <Text style={[styles.title, {color}]}>{title}</Text>
            </Pressable>
            
        </View>
    )
}

export default categories

const styles = StyleSheet.create({
    flatlistcontainer: {
        paddingHorizontal: wp(4),
        gap: 8
    },
    category: {
        padding: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        // backgroundColor: 'white',
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
    },
    title: {
        fontSize: hp(3),
        fontWeight: theme.fontWeights.medium,
    }
})