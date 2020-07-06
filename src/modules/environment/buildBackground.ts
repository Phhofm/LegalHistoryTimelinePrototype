// import modules
import toColor from '../helper/toRGBAColor';
import setUpParticleBackground from './setUpParticleBackground';
import TimeLine from "../../timeLine";

/* BACKGROUND */
/******************************************************************************************************************/
export default (timeline: TimeLine) => {

    let __retParticleBackground = null;

    if (timeline.background >= 1) { // using particles.js library

        let particlesJSON;
        let backgroundAmount;
        let backgroundDensity;
        let color = toColor(timeline.particleColor);
        let backgroundOpacity;
        let backgroundOpacityRandom;
        let opacityAnimEnable;
        let opacityAnimSpeed;
        let opacityAnimOpacityMin;
        let backgroundSize;
        let backgroundSizeRandom;
        let sizeAnimEnable;
        let sizeAnimSpeed;
        let sizeAnimSizeMin;
        let lineLinkedEnable;
        let lineLinkedDistance;
        let lineLinkedWidth;
        let moveSpeed;
        let moveRandom;

        if (timeline.background === 1) { // stars
            backgroundAmount = timeline.background1.backgroundAmount;
            backgroundDensity = timeline.background1.backgroundDensity;
            backgroundOpacity = timeline.background1.backgroundOpacity;
            backgroundOpacityRandom = timeline.background1.backgroundOpacityRandom;
            opacityAnimEnable = true;
            opacityAnimSpeed = 0.2;
            opacityAnimOpacityMin = 0;
            backgroundSize = timeline.background1.backgroundSize;
            backgroundSizeRandom = timeline.background1.backgroundSizeRandom;
            sizeAnimEnable = true;
            sizeAnimSpeed = 2;
            sizeAnimSizeMin = 0;
            lineLinkedEnable = false;
            lineLinkedDistance = 150;
            lineLinkedWidth = 1;
            moveSpeed = timeline.background1.backgroundMoveSpeed;
            moveRandom = true;
        } else if (timeline.background === 2) { // wires / lines
            backgroundAmount = timeline.background2.backgroundAmount;
            backgroundDensity = timeline.background2.backgroundDensity;
            backgroundOpacity = timeline.background2.backgroundOpacity;
            backgroundOpacityRandom = timeline.background2.backgroundOpacityRandom;
            opacityAnimEnable = false;
            opacityAnimSpeed = 1;
            opacityAnimOpacityMin = 0.1;
            backgroundSize = timeline.background2.backgroundSize;
            backgroundSizeRandom = timeline.background2.backgroundSizeRandom;
            sizeAnimEnable = false;
            sizeAnimSpeed = 40;
            sizeAnimSizeMin = 0.1;
            lineLinkedEnable = true;
            lineLinkedDistance = 157.82952832645452;
            lineLinkedWidth = timeline.background2.backgroundSize;
            moveSpeed = timeline.background2.backgroundMoveSpeed;
            moveRandom = false;
        }

        particlesJSON = {
            "particles": {
                "number": {
                    "value": backgroundAmount,
                    "density": {
                        "enable": true,
                        "value_area": backgroundDensity
                    }
                },
                "color": {
                    "value": color
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": color
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": backgroundOpacity,
                    "random": backgroundOpacityRandom,
                    "anim": {
                        "enable": opacityAnimEnable,
                        "speed": opacityAnimSpeed,
                        "opacity_min": opacityAnimOpacityMin,
                        "sync": false
                    }
                },
                "size": {
                    "value": backgroundSize,
                    "random": backgroundSizeRandom,
                    "anim": {
                        "enable": sizeAnimEnable,
                        "speed": sizeAnimSpeed,
                        "size_min": sizeAnimSizeMin,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": lineLinkedEnable,
                    "distance": lineLinkedDistance,
                    "color": color,
                    "opacity": 0.4,
                    "width": lineLinkedWidth
                },
                "move": {
                    "enable": true,
                    "speed": moveSpeed,
                    "direction": "none",
                    "random": moveRandom,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": { // disabled since canvas layering
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": false, // disabled
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": false, // disabled
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": timeline.background1.backgroundOnHoverDistance,
                        "size": 2,
                        "duration": 3,
                        "opacity": 3,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        };

        // christmas / snow edition. This is more for fun, can be deleted later.
        // maybe use a similiar background picture. The example is here: https://codepen.io/n-sayenko/pen/qOXKVr
        if (timeline.background === 3) {
            particlesJSON = {
                "particles": {
                    "number": {
                        "value": 400,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "image",
                        "stroke": {
                            "width": 3,
                            "color": "#fff"
                        },
                        "polygon": {
                            "nb_sides": 5
                        },
                        "image": {
                            "src": "http://www.dynamicdigital.us/wp-content/uploads/2013/02/starburst_white_300_drop_2.png",
                            "width": 100,
                            "height": 100
                        }
                    },
                    "opacity": {
                        "value": 0.7,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 5,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 20,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": false,
                        "distance": 50,
                        "color": "#ffffff",
                        "opacity": 0.6,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 5,
                        "direction": "bottom",
                        "random": true,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": true,
                            "rotateX": 300,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "bubble"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 150,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 100,
                            "size": 7,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.2
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            };
        }

        //@ts-ignore this method exists
        particlesJS("scene-container", particlesJSON);
    } else {
        __retParticleBackground = setUpParticleBackground(timeline.backgroundColor, timeline.particleColor);
        if (!timeline.pixelWaveBackground) {
            __retParticleBackground.particleScene.visible = false;
        }
    }

    let backgroundColor = toColor(timeline.backgroundColor);

    //layer canvases for particles.js so mouse interaction like panning still works, but this makes mousehover effect unusable
    if (timeline.background >= 1) {
        const canvas2 = document.getElementsByClassName('particles-js-canvas-el');
        const item = canvas2.item(0);

        if (item) { // not null (or undefined/NaN/''/0/false) check

            //@ts-ignore
            item.style.position = "absolute";
            //@ts-ignore
            item.style.backgroundColor = backgroundColor;


            const container = document.getElementById('scene-container');
            if (container) { // not null (or undefined/NaN/''/0/false) check
                if (container.children[2]) {
                    //@ts-ignore
                    container.children[1].style.position = "relative";
                }

                // an element cannot be present twice in de DOM, since we add the same element again at the first position the other one gets removed

                container.insertBefore(item, container.firstChild);
            }
        }
    }

    return __retParticleBackground;

}

/******************************************************************************************************************/
/* END OF BACKGROUND */