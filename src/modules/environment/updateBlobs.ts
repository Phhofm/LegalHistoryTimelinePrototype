//@ts-ignore
import Simplex from 'perlin-simplex';

/* CREATE BLOBS */
// this creates the blobs that are placed on the timeline
//https://codepen.io/farisk/pen/vrbzwL
/**********************************************************************************************************************/

// @ts-ignore
export default (sphere, timeline) => {

    // change '0.003' for more aggressive animation
    const time = performance.now() * 0.0001;
    //console.log(time)

    if (sphere.userData.Clicked) {
        //go through vertices here and reposition them

        // change 'k' value for more spikes
        const k = 1;
        for (let i = 0; i < sphere.geometry.vertices.length; i++) {
            const p = sphere.geometry.vertices[i];
            //p.normalize().multiplyScalar(1 + 0.3 * noise.perlin3(p.x * k + time, p.y * k, p.z * k));
            const simplex = new Simplex();
            p.normalize().multiplyScalar(timeline.sphereRadius + timeline.twitchingExtent * simplex.noise3d(p.x * k + time, p.y * k, p.z * k));
        }
        sphere.geometry.computeVertexNormals();
        sphere.geometry.normalsNeedUpdate = true;
        sphere.geometry.verticesNeedUpdate = true;
    } else {
        //go through vertices here and reposition them
        // change 'k' value for more spikes
        const k = 1;
        for (let i = 0; i < sphere.geometry.vertices.length; i++) {
            const p = sphere.geometry.vertices[i];
            //p.normalize().multiplyScalar(1 + 0.3 * noise.perlin3(p.x * k + time, p.y * k, p.z * k));
            const simplex = new Simplex();
            p.normalize().multiplyScalar(timeline.sphereRadius + 0.5 * simplex.noise3d(p.x * k + time, p.y * k, p.z * k));
        }
        sphere.geometry.computeVertexNormals();
        sphere.geometry.normalsNeedUpdate = true;
        sphere.geometry.verticesNeedUpdate = true;
    }

}

/**********************************************************************************************************************/
/* END OF CREATE BLOBS */