// Doctor's profile images
export const getProfileImage = (pic) => {
    switch (pic) {
      case '1':
        return require('../assets/images/1.jpg');
      case '2':
        return require('../assets/images/2.jpg');
      case '3':
        return require('../assets/images/3.jpg');
      case '4':
        return require('../assets/images/4.jpg');
      case '5':
        return require('../assets/images/5.jpg');
      case '6':
        return require('../assets/images/6.jpg');
      case '7':
        return require('../assets/images/7.jpg');
      case '8':
        return require('../assets/images/8.jpg');
      case '9':
        return require('../assets/images/9.jpg');
      default:
        return require('../assets/images/default.jpg'); // Optional fallback image
    }
  };
  
  