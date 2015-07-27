##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVtsCtAAoJEHNBsVwHCHes2FwIAIwdNFcEnbqrbZqn3aKqNGfv
aCi5aK2IQwr/OWuIrHXLjFqJupdoB3WIxF0tX6JWLlDdc7UB7Xn4vHiyn4EbLuSG
ig6krDsEo1WzXDPWv62CDx+DrjSVGJ1RlywsKQwbBn6+OvSm9OxZ3bqLLCtNU/z+
aRann0IEzJ2mhlKOkkbtsjPPNV1RorM0JbQNBnL5W6jeN+N35TtNEJzwJc7bHgJ4
fU6DBcVp4DhS3HJEc5Sky5lI7r3fExlxnFVZZJlm/5cTCFOz8uYvqSP6UgZwHU0l
ab9oUALYJnq202s/yoLQtBcEXicgQbsox8+8Yg7rA/GfzByyYJf7tjAxpqI4NYY=
=GG6r
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
1963   x         citgm              4ea7a042f2150a19522c6b14f66a2d2c2b6254e9b6a15671293a6a66e2377929
8056   x         citgm-dockerify    6b595088d589daf67e946f7e079f93a099942ced7091caca07a06a0757fa3a77
               known/                                                                               
                 lodash/                                                                            
43                 lookup.json      af3ecb554661a1664a9cc10db8b26dd8ab713aa2490c81f6f055fe36f66095dc
121    x           test.js          fb292b5b5d811b68dcf2dac7ef04ff06c0ce3ebac1f38235f02d58fbebb33550
               lib/                                                                                 
12148            citgm.js           6104bf28e8b8c31f5916e4e5ae4fdf7aa080f369a97f8b0a0560f035b9b67b37
2799             lookup.js          f5f951ba0b10e653ae5c6e1bb70fed4368a0f6c4cfef60c1d85a01323aaf04e5
1466             lookup.json        340d61ff3abc8e8676a0e12362daab9395f1a8b243bbc80c8d5959daa0bb1be4
1505             out.js             d726c2820cca48ff7453f9e4e389160dfe7c92602aeefd17adb93789c5ea3aea
515              update.js          5ff2e2fc6de8067dc7055d3869ac069c327f679d4f5e0efe37ce29162c00270a
1245           LICENSE.md           4a5219d108dde0fd90f5cb67ff3eeeb1efad9569d785ccc1ea543d23d536fd5f
               man/                                                                                 
2564             citgm-dockerify.1  7dbb503c53f7da4e8b1414665d0571ae8f86a7032132ac66ac3a5670493ac031
2563             citgm.1            d5989c7f373bcba3704c0fc72e5e063aeda65ab826909c0bf0b0402b3eba0e97
1302           package.json         f2df46b47415e8221787ddd9324a543e7af75164bd1710774c5ead99efc64bd4
10299          README.md            ecc665d5f622812d29c8fededa190689b8b9768ece13df6d4b9996f88cdf29e0
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