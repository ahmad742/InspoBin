import React, { useState, useEffect, useRef } from "react";
import { Pressable, View, ActivityIndicator, StyleSheet } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Video from "react-native-video";
// -------------------------------------
import colors from '../Utils/colors';

const VideoPlayer = (props) => {
    const { URL, isNotCurrent } = props

    const videoRef = useRef(null)

    const [isPaused, setIsPaused] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsPaused(true)
        console.log({ isNotCurrent }, '   ', { isPaused });
    }, [isNotCurrent])

    const renderPlayButton = () => {
        if (isPaused) {
            return (
                <View
                    style={{
                        backgroundColor: "white",
                        padding: 10,
                        borderRadius: 150,
                    }}>
                    <Entypo name={"controller-play"} size={30} />
                </View>
            )
        } else if (loading) {
            return (
                <ActivityIndicator
                    color={colors.primary}
                    size={"large"}
                />
            )
        } else return null
    }

    const renderPlayerControll = () => {
        return (
            <Pressable
                onPress={() => {
                    setIsPaused(!isPaused)
                    // console.log('hehehehe');
                }}
                style={{
                    ...StyleSheet.absoluteFill,
                    left: 80,
                    right: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {renderPlayButton()}
            </Pressable>
        )
    }

    const changeState= async()=>{
      setIsPaused(true)
    }

    return (
        <View>
            <Video
                ref={videoRef}
                // onBuffer={({ isBuffering }) => {
                //     setLoading(isBuffering);
                // }}
                playInBackground={false}
                paused={isPaused}
                resizeMode={"contain"}
                onLoadStart={() => setLoading(true)}
                onLoad={() => setLoading(false)}
                // controls={true}
                onProgress={(data) => {
                    setLoading(false)
                    // console.log("onProgress", data.currentTime, URL)
                }}
                repeat={false}
                ignoreSilentSwitch='ignore'
                onEnd={async(res) => {
                    console.log("onEnd", { isPaused }, {res});
                    await changeState()
                    console.log({isPaused});
                    if (!isPaused) {
                        videoRef.current.seek(0.0)
                    }
                }}
                source={{ uri: URL }}
                style={{ width: '100%', height: 250, backgroundColor: colors.black }}
            />
            {renderPlayerControll()}
        </View>
    );
}
export default VideoPlayer;
