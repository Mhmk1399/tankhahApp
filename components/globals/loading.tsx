import React from "react";
import { View, Image, StyleSheet, Modal } from "react-native";

interface LoadingProps {
  visible: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ visible }) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.loadingWrapper}>
          <Image
            source={require("../../assets/animation/loadingnative.gif")}
            style={styles.loadingGif}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingWrapper: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingGif: {
    width: 100,
    height: 100,
  },
});
