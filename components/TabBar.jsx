import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign, Feather } from '@expo/vector-icons';

const TabBar = ({ state, descriptors, navigation }) => {
    const primaryColor = '#673ab7';
    const greyColor = '#222';

    const icons = {
        index: (props) => <AntDesign name="home" size={26} color={greyColor} {...props} />, 
        create: (props) => <AntDesign name="pluscircleo" size={26} color={greyColor} {...props} />, 
        explore: (props) => <Feather name="compass" size={26} color={greyColor} {...props} />, 
        profile: (props) => <AntDesign name="user" size={26} color={greyColor} {...props} />, 
        map: (props) => <Feather name="map-pin" size={30} {...props} />, 
    };

    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                if (['_sitemap', '+not-found'].includes(route.name)) return null;
                
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel ?? options.title ?? route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.name}
                        style={[styles.tabbarItem, route.name === "map" ? styles.mapTab : null]}
                        accessibilityRole='button'
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    >
                        <View style={route.name === "map" ? styles.mapIconBackground : null}>
                            {icons[route.name]({ color: isFocused ? primaryColor : greyColor })}
                        </View>
                        <Text style={{ color: isFocused ? primaryColor : greyColor, fontSize: 11 }}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default TabBar;

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        width: '90%',
        alignSelf: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    mapTab: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapIconBackground: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: '#673ab7',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
