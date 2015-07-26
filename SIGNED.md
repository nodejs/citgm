##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVtUUcAAoJEHNBsVwHCHesoYUH+wWpf/rXy83dxykNM+PNg1De
GY7rPqoVexHglBaJfcaGJa8oFT2LAigiNxOGgt3Aw8F/5/eqz0LHTptaWxYqO+OY
Q5EqhdMOZTYFGw2FyMOU+rMnU9hKm5ckuoNF6rrSx56HHe9e/T8YI2FT6y2z1UYI
o3yRwSTR/WMch1BzSkK57wu2VI1kL9hHuJBWBxFhLkvsBmqZ0RcUd0vcqI4D7Tr+
jVJdp5+WE5PiOFhsPl3x2fz2ED686UZ/QbuCppUG4Lj8W/j80qpAqCv9U5TAFNpH
jvB2S9g8wW69KJTMm+FfYXmaj/1ChP+XG+OJ4axpUHu5bOsGrgNvrYzsOmQOQGc=
=FSYx
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
1964   x         citgm              a05effec7302065b65340a81deb3231df8449d1e4e09657532007d1240b08103
8057   x         citgm-dockerify    b2234a6c832b40e2d864999aa932fec52cc85816b2b43e87d5f6813534149754
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
2565             citgm-dockerify.1  6b3b6dd3247c9acefe2f0ce50183e6eb0ae7da9031db4065649ddb6d0adb77fa
2564             citgm.1            ae040c3ecb5119b8d1a4753b48b446227f964700fb1efcf4f35fbd708ccb7082
1305           package.json         5a9646c383dcff8d4327bf811190e76fa12fc9c886500ff0156b1d79507bb734
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