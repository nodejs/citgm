##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsGidAAoJEHNBsVwHCHesXNkH/2qSmaCZMIit56X6s5mol9UA
ytFSxGzWOToI2ojtgOZpp8TlU+CbhH2BTW2u4v1lnFD+SZp5z5KziGum1CxYr+Fo
f4VextqLKg6OsRvxOikutPEPAPQV+I15PGU0PYqGDHiNy1T2Gyuald7Zjj+dSrvU
e0CtaNc6ch2F9/zTiukdzm680LguzUzGC7v7yg0Lji8jFjDffWaBud8c+vow8bsI
2daebhCtp0gEPrJ9fDSMETs4aZ4U0G2RxERGYpPZV/RT8oTwz8G6TZiv8rC+8s/B
WE/NNo5gTjdwunE0vGXXwheKjNGIF1K8A4RMK1RiL2wIRNcpXgFlhGaVbTcwAX8=
=bxeU
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size  exec  file            contents                                                        
            ./                                                                              
13            .gitignore    16d30e4462189fb14dd611bdb708c510630c576a1f35b9383e89a4352da36c97
19            .jshintrc     d862dcf6091929f90429363ddf72864c1076a22e9f2673f35552a05ba056ce49
              bin/                                                                          
1230  x         citgm       7ca784d860611ce167e30758e95b6f6964ebbc192cc9ec7bda13ee3badc33397
              known/                                                                        
                lodash/                                                                     
123   x           test.js   dca87bee9bc057b642eda9f0ae059cc245a7b7a81e63809221e7a59f4aca644f
              lib/                                                                          
7919            citgm.js    da3e868696acebf9079d052f9a6f1b995c399b55c511c3fdb50adf39b521215d
596           package.json  781ef7d009a5b24760c86f781d570d02f306e8b37f1e83e957862f2ff0be1d6b
350           README.md     053282281afb8859ee1904b39d9152248e49a9a2a3ff6472b462a3ab51aa1737
              test/                                                                         
441             test.js     d31b6d84d9cf1252883c0dd1d2a4d2055c2a25e300430a80320eeba088f9791b
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