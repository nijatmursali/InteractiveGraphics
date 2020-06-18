<h1 align="center">
<img src="https://logos-download.com/wp-content/uploads/2019/07/Sapienza_Roma_Logo.png"
      alt="Sapienza" width="80%" />
</h1>

<h2 align="center">Artificial Intelligence and Robotics</h2>

<h3 align="center">Interactive Graphics</h3>

<h4 align="center">2020 June</h4>

<h4 align="center">Nijat Mursali | 1919669</h4>

<h4 align="center">HOMEWORK 2</h4>

---

## Table of Contents
- [Abstract](#abstract)
- [Development](#development)
- [Results](#results)
- [Conclusion](#conclusion)


## Abstract

The fundamental idea of this homework was to create a hierarchical model of a simplified
Grizzly bear which holds body, 4 legs, head and tail where all of the elements are cubes. Next
step was to add a texture to all faces of the bear, except the head where we needed to add
different texture to the head. Then, we needed to make a simplified model of a tree that was
near the bear and the main functionality was to animate the bear where it goes near the tree
by walking, then stands up and scratches its back against the tree.
The following paragraphs show all the description and the technique used for the given
homework.

## Development

### Create a hierarchical model of a simplified Grizzly bear

As mentioned in the homework file, the bear should contain the torso, tail head and legs
(which are upper and lower legs). As in template file, the elements in my object were also put
in an object hierarchy that was helpful for us to represent the complex model by getting more
control of it easily. As we also read from the book, the main component in the model was the
torso which combined all other elements in itself and those elements moved within the torso.
Thus, the hierarchy of the bear’s objects is as follows:


<p align="center">
  <img src = "https://github.com/SapienzaInteractiveGraphicsCourse/homework2-nijatmursaliIG/blob/master/screenshots/download.png">
</p>
<p align="center">Fig 1. Hierarchical Model of Bear</p>


### Add a texture to the all faces of the bear, except the head.

In order to add the texture to the bear, I have used the same method we have used in
homework 1, where we get the texture from the ID and use the function to display it.
However, in this case, we needed to add two textures as required, for both head and other
elements in bear object. So, we have added the IDs to all the functions such as torso, legs and
tail for having the same texture, but for the head we have used a different texture. In order to
show the texture in our WebGL, we have also added the flags into the fragment shader.

### Create a very simplified model of a tree and position it near the bear.

As it was required to create a simplified model of a tree, we just used two cube functions to
make it, where the first one was for the body of the tree and another was for the head of the
tree. We have just scaled those elements and translated them into the correct position for the
fourth case.

<p align="center">
  <img src = "https://github.com/SapienzaInteractiveGraphicsCourse/homework2-nijatmursaliIG/blob/master/screenshots/2.png">
</p>
<p align="center">Fig 2. Bear and Tree</p>

### Animate the bear that walks near the tree, then stands up and starts

### scratching its back against the tree.

The animation of our bear model has been done by using the conditional statements and flags
where we used them to check the movements of the model. To be successful at this, we
needed to animate the elements of the object separately (but, we also know legs move
synchronously) to get the better results for each case. As our model needed to do several
things we also created the functions for all of them. The first function for animation was to
move our object where the bear model moved from initial point to near the tree model. The


second function was for making the bear stand where we got the position of the tree and
when the bear comes to that position it just stands up (we have done that by checking the
torso rotation) where the torso goes up. However, in this case normally the legs also go up
because they are connected to the torso. Thus, we just moved the legs downwards as the torso
went up and we stopped the torso at one point. Then, the last function starts where the bear
model rotates in the z-axis and scratches its back to the tree.

## Results

Before going to results, I would like to say I have also developed the viewer position for this
homework, where the user can move the camera in 360 bypressingfourbuttonsassigned.
°
It’s similar to the first homework I have done where I have used alpha, beta and radius
values. In order to update the model-view matrix we have used the ​ _lookAt_ ​function that
helped us a lot by getting the views.

<p align="center">
  <img src = "https://github.com/SapienzaInteractiveGraphicsCourse/homework2-nijatmursaliIG/blob/master/screenshots/3.png">
</p>
<p align="center">Fig 3. Final version with view</p>


## Conclusion

To conclude, this homework was helpful for us to get more knowledge on WebGL in order to
make animations for different objects. For the future work, we would like to deepen our
knowledge on animation and apply it to different models with different functions.


