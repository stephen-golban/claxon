import { Image } from "expo-image";
import { StyleSheet } from "react-native";

const DEFAULT_AVATAR_BLURHASH =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const ProfileAvatarImg: React.FC<{ uri: string }> = ({ uri }) => {
  return (
    <Image
      priority="high"
      transition={1000}
      style={styles.image}
      cachePolicy="memory-disk"
      source={{ uri }}
      placeholder={{ blurhash: DEFAULT_AVATAR_BLURHASH }}
      contentFit="cover"
    />
  );
};

export default ProfileAvatarImg;

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
  },
});
