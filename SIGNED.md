##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVwP3BAAoJEHNBsVwHCHesOYAH/2SS7VERDwkVa4lLrEWJXgIJ
d9TVumyE6WPO1LoWIjPy4tm/h6sE+7EZc4BCnNccRyV+ctFQcRWrBu1IkeSO963f
UQzRHyVhPe31i6rvgC9JccbMkxa2GSZJVNcaCrMYCtnYS/GPL6u9a5OE2+lgIBJR
fA30akbYcGrWoBEPqd9KKabCuqOhBN8Sxm1lq+hAag+ApZENxPlbhaAjQBQnF8Vx
ICs52GjK/KaCsxt0U3OGuE7a3QP/EZTfzp+tFYaFzmdyuWSpxNsmdL+FM4aYpU7s
H58QKt3Sw4fsi8iQniULMwpcX61Bx/mAAuHPi5SmXAdPi7cIOVo/S/lONJ4jUZo=
=t7I6
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
2100   x         citgm              4c4aa3615fffe837b0d02d4ce6ded745b6b8d9b170065bfef430f568e6afefe4
10515  x         citgm-dockerify    46c5f5525b370629367c21512968875a19b09125f8f084228b07fc6ca1e5358b
               known/                                                                               
                 lodash/                                                                            
43                 lookup.json      af3ecb554661a1664a9cc10db8b26dd8ab713aa2490c81f6f055fe36f66095dc
121    x           test.js          fb292b5b5d811b68dcf2dac7ef04ff06c0ce3ebac1f38235f02d58fbebb33550
               lib/                                                                                 
12411            citgm.js           c2d1e9aaf8e5afc7361fdafe55e66b48b9e969d2b0552187c1db224fad64b9bc
2799             lookup.js          f5f951ba0b10e653ae5c6e1bb70fed4368a0f6c4cfef60c1d85a01323aaf04e5
1466             lookup.json        340d61ff3abc8e8676a0e12362daab9395f1a8b243bbc80c8d5959daa0bb1be4
1505             out.js             d726c2820cca48ff7453f9e4e389160dfe7c92602aeefd17adb93789c5ea3aea
515              update.js          5ff2e2fc6de8067dc7055d3869ac069c327f679d4f5e0efe37ce29162c00270a
1245           LICENSE.md           4a5219d108dde0fd90f5cb67ff3eeeb1efad9569d785ccc1ea543d23d536fd5f
               man/                                                                                 
2564             citgm-dockerify.1  7dbb503c53f7da4e8b1414665d0571ae8f86a7032132ac66ac3a5670493ac031
2563             citgm.1            d5989c7f373bcba3704c0fc72e5e063aeda65ab826909c0bf0b0402b3eba0e97
1302           package.json         92a6d4d5c40c19ac3fece88c470aa474946c4440463e7e2ec14f488383153176
10959          README.md            42dc30aa4b584c9aa8e3e8ad2fef167fe598659a6c0179ed459e9801f17baf23
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