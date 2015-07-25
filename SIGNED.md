##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsuRiAAoJEHNBsVwHCHes96YH/2kENa8n6d1Gccfz1Vww1RVK
SbqjrLp3DHqpk9Fe57BLgjWkajJswFdpBHL6LZrsDF0iRlVWAr5ICV6+uN/In5qq
oNwykf6gcUT/m331b3FLnQ/PTeIsHy87zQuKUHK/7gMA0lgLlTzIK+VCH0KgR0/S
qFgCf9OfPnZHOVUCeNiIUF4cy+6aHQEbvpfdDlUfXohMAQH+Y2Z6G9BoiGlNZctx
seHqT3SBAbagFwd56gCCYnohaie2BVuJa7KO2oMe65uwo1hVVpTpYSljMYokhiHS
P+Tch0dxhfChbYcdLAh4r75vQ/Zbu+myyHOXqJXIuJmnXz0VuYx5Zp2yKN+l6Ac=
=3joF
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size   exec  file                 contents                                                        
             ./                                                                                   
13             .gitignore         16d30e4462189fb14dd611bdb708c510630c576a1f35b9383e89a4352da36c97
19             .jshintrc          d862dcf6091929f90429363ddf72864c1076a22e9f2673f35552a05ba056ce49
               bin/                                                                               
1647   x         citgm            46a1560e0f0da486a37a8df5f66c62dbc125cd82ad7f23e22df59e29008d443c
7661   x         citgm-dockerify  55d752afdee0123f364c04507ae2ceb1e42e4c7d6cc70447795c3ae9996286e6
               known/                                                                             
                 lodash/                                                                          
121    x           test.js        fb292b5b5d811b68dcf2dac7ef04ff06c0ce3ebac1f38235f02d58fbebb33550
               lib/                                                                               
11232            citgm.js         68b20684d5f6316614fc24727c88bf85e0c1c64b2f33c0aad1679678bf529603
2824             lookup.js        cd28d33fb5de865a203ea9717287cb0daa6407ec17b18d9c99d244a14db5c243
1504             lookup.json      cd41e56055054db234d3ca06b095ea67afba3a2b23ded9b52665228d915c36e1
1505             out.js           d726c2820cca48ff7453f9e4e389160dfe7c92602aeefd17adb93789c5ea3aea
1238           LICENSE.md         1e6b09b8752ff67f0dad3899a9eb205eeabd6001fcbe210bfb122ccdb1dbda4c
945            package.json       3a02ac12cc0e8e4b91dc52ecc703ea47c23d3678100b624d81c2b797abdaa192
8754           README.md          1d38b58b0e94676aabfb96227567d719a5fe0d8fc977ab3df4ac51fb5422e8e6
               test/                                                                              
                 test-dir/                                                                        
26                 index.js       0e3ff6bf26b1727bdb29101212803b124fd519a2ac3c351cde3beb8d21c3118f
174                package.json   b8b4842fdcaed06b4536d6df184061bc31bb330c16b8df2d7a13bed15a5ad83f
426              test.js          c76988cf9c15adf3d7d3bdbcbb846b1d1b18d1adc9ff6651d1c7fa67ad31860d
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