##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVs/wPAAoJEHNBsVwHCHessYoIAJof0LuVaTViYr4woBb2wKDF
JzNUa0Q4oALr3ZnQYOfUxgYhHYh0qzOQC1n/q7eBUY/bPw76k/j5URluEEtaSfH1
JlkPUoVlXEf+SH7hLLQGF6UnFtwINiTgLpA15IyW5ljkGFXXiuo2Oal99wzomW4e
GAXlkZCP4w+B1MzCwnHvdLIi2ah8xVbrpJYNiY/V4GxTd3vQ8gLm9ibl0Bp/MtA6
I1+xmyOCey7NBe97LwGxiQSs1AKDbq+ziOWvKEuirWTqbjcb5KczHUIsezbVMtJB
rmUa5HKE/bXBgrJJ4FGX4r5CO2wSsf0jOEd8x9Kn7rsXqPU5QQGf2UrNx+/xgI0=
=D2yQ
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size   exec  file                   contents                                                        
             ./                                                                                     
13             .gitignore           16d30e4462189fb14dd611bdb708c510630c576a1f35b9383e89a4352da36c97
19             .jshintrc            d862dcf6091929f90429363ddf72864c1076a22e9f2673f35552a05ba056ce49
54             AUTHORS              47bb87633797121247b7c831c6090ddc32f3e7b91072914a7035398a3dd738b1
               bin/                                                                                 
1647   x         citgm              7fc1f0a8ca2d8c36327b907b0d42a1e74c5f9ecae84f078509bcda34b06b9b5a
7696   x         citgm-dockerify    d4842cf74e532e23be535455386e6b3815de2755a5ffafc49eafdffe98322e69
               known/                                                                               
                 lodash/                                                                            
43                 lookup.json      af3ecb554661a1664a9cc10db8b26dd8ab713aa2490c81f6f055fe36f66095dc
121    x           test.js          fb292b5b5d811b68dcf2dac7ef04ff06c0ce3ebac1f38235f02d58fbebb33550
               lib/                                                                                 
12148            citgm.js           6104bf28e8b8c31f5916e4e5ae4fdf7aa080f369a97f8b0a0560f035b9b67b37
2799             lookup.js          f5f951ba0b10e653ae5c6e1bb70fed4368a0f6c4cfef60c1d85a01323aaf04e5
1466             lookup.json        340d61ff3abc8e8676a0e12362daab9395f1a8b243bbc80c8d5959daa0bb1be4
1505             out.js             d726c2820cca48ff7453f9e4e389160dfe7c92602aeefd17adb93789c5ea3aea
1245           LICENSE.md           4a5219d108dde0fd90f5cb67ff3eeeb1efad9569d785ccc1ea543d23d536fd5f
               man/                                                                                 
2510             citgm-dockerify.1  d3d072b551bf511b992c86def24e7c8acb84965245e4cee025d78a35b525169b
2509             citgm.1            e7362eb6932819600b489f8eba2700d6eff40778b25e3f034a4f9f0993ef1fd3
1220           package.json         ec619a24261e32c8c27c39b07d7b04610458d4980ac2db743b756760ca71ab63
9245           README.md            1e2cb8fd462347e052039842f447eabf5500e21d4509f4e34eacc47bcca45891
               test/                                                                                
                 test-dir/                                                                          
26                 index.js         0e3ff6bf26b1727bdb29101212803b124fd519a2ac3c351cde3beb8d21c3118f
174                package.json     b8b4842fdcaed06b4536d6df184061bc31bb330c16b8df2d7a13bed15a5ad83f
45               test-script.js     536a80b7a731b6e45bae705ab19c91b84261a5913933bc7dd8679adc9a3fa950
2039             test.js            7e96a08b893fcf416c6274ad7e73e80f28252220c56f922be686df790883a574
                 test2-dir/                                                                         
180                package.json     02f970de000917877fca58737d29448c5885222261c64b69be40d4da9594213e
```

#### Ignore

```
/SIGNED.md
```

#### Presets

```
git      # ignore .git and anything as described by .gitignore files
dropbox  # ignore .dropbox-cache and other Dropbox-related files    
kb       # ignore anything as described by .kbignore files          
```

<!-- summarize version = 0.0.9 -->

### End signed statement

<hr>

#### Notes

With keybase you can sign any directory's contents, whether it's a git repo,
source code distribution, or a personal documents folder. It aims to replace the drudgery of:

  1. comparing a zipped file to a detached statement
  2. downloading a public key
  3. confirming it is in fact the author's by reviewing public statements they've made, using it

All in one simple command:

```bash
keybase dir verify
```

There are lots of options, including assertions for automating your checks.

For more info, check out https://keybase.io/docs/command_line/code_signing