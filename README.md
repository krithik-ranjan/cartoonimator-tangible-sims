# cartoonimator-tangible-sims

To run:
```
> ($env:HTTPS = "true") -and (npm start --host)
```

To deploy:
```
> npm run deploy
```

### To-Do's

Bugs 
- [x] Animated object looping on the other side of the frame (exceeding bounds on the left makes part of the object appear on the right)

UI
- [x] Add camera selection control on homepage 
- [ ] ~~Add camera mirror control on homepage~~
- [x] Add replay and download functionality
- [x] **Mobile styles and sizes** 
- [x] Add toggle for ellipse
- [x] Make camera load faster

Animation 
- [ ] Fix starting position of asteroid
- [ ] Recalculate ellipse if new objects picture is taken

Functionality 
- [x] Fix capture button flicker

Other 
- [ ] Make the mirror mount for camera

### References
[Github Pages deployment](https://github.com/gitname/react-gh-pages) 