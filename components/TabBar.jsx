import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter
import colors from './ColorTamp';

const TabBar = ({ state, descriptors, navigation }) => {

    // Check if the active route is "map"
    const activeRouteName = state.routes[state.index].name;
    if (activeRouteName === 'map') {
        return null; // Hide the tab bar when "map" is active
    }
    
    const primaryColor = 'rgb(94, 195, 253)';
    const greyColor = '#222';
    const router = useRouter(); // Get the router instance
    
    const icons = {
        index: (props) => <AntDesign name="home" size={26} color={greyColor} {...props} />, 
        DrSchedule: (props) => <AntDesign name="user" size={26} color={greyColor} {...props} />, 
        alerts: (props) => <MaterialIcons name="notifications-none" size={26} color={greyColor} {...props} />, 
        settings: (props) => <Feather name="settings" size={24} color={greyColor} {...props} />, 
        map: (props) => <Feather name="map-pin" size={30} {...props} />, 
    };

    const onPress = (route) => {
        // Navigate to 'map' screen
        if (route.name === 'map') {
            router.push('/mappage'); // Navigate to the "mappage" screen directly
        } else {
            // Normal tab press behavior
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });
            if (state.index !== state.routes.findIndex(r => r.name === route.name) && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
            }
        }
    };

    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                if (['_sitemap', '+not-found'].includes(route.name)) return null;
                
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel ?? options.title ?? route.name;
                const isFocused = state.index === index;

                return (
                    <TouchableOpacity
                        key={route.name}
                        style={[styles.tabbarItem, route.name === "map" ? styles.mapTab : null]}
                        accessibilityRole='button'
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={() => onPress(route)} // Pass the route to onPress
                    >
                        <View style={route.name === "map" ? styles.mapIconBackground : null}>
                            {icons[route.name]({ color: isFocused ? colors.primary : greyColor })}
                        </View>
                        <Text style={{ color: isFocused ? colors.primary : greyColor, fontSize: 11 }}>{label}</Text>
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
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
