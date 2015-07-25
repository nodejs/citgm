##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVs8DLAAoJEHNBsVwHCHesVk4IAIM2dh2C34l1x+qrvcTAbg+d
17gZQ4dAP3o7XP1TOj60t9IgnxU3Vkpcaz3+H4UGf+HXowtFujownjiOn6siFHcK
Swhl2C3j0j/bufpsX2Z3lKAI9UHiqPYgMPa3NDsOmVc3rpkpkWiOE+DTSPIW3lZP
9RJyjCWUD5MvcRUahyRHuG3o37Mn7GFfof3DlR/5FFcEaGAI7SXZlIL6qPNRgWuI
UFyFNtUTS0pztei9by/gOY2EYyZXDz8b4akhq94jfEyH5KItl+tqn4DhSsI1q/BY
kh4YDGZdM+wJytslVVEAwKOj0BG9X4HYmvKk/T/3oD1Gaf5POyGz9KTDr4JKxJw=
=6d1w
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
1647   x         citgm            c0115c2b8f4c1899e26dcf0cb9d416e556493487dc7259b9930100e95f782564
7696   x         citgm-dockerify  49d98d662eac61d1ba4e032516441be689d4637f9d92ee3565ac05e2e874872b
               known/                                                                             
                 lodash/                                                                          
43                 lookup.json    af3ecb554661a1664a9cc10db8b26dd8ab713aa2490c81f6f055fe36f66095dc
121    x           test.js        fb292b5b5d811b68dcf2dac7ef04ff06c0ce3ebac1f38235f02d58fbebb33550
               lib/                                                                               
11232            citgm.js         68b20684d5f6316614fc24727c88bf85e0c1c64b2f33c0aad1679678bf529603
2799             lookup.js        f5f951ba0b10e653ae5c6e1bb70fed4368a0f6c4cfef60c1d85a01323aaf04e5
1504             lookup.json      cd41e56055054db234d3ca06b095ea67afba3a2b23ded9b52665228d915c36e1
1505             out.js           d726c2820cca48ff7453f9e4e389160dfe7c92602aeefd17adb93789c5ea3aea
1238           LICENSE.md         1e6b09b8752ff67f0dad3899a9eb205eeabd6001fcbe210bfb122ccdb1dbda4c
27             Makefile           07e0da23bfcc5602033dc8964796fd713b095718217648b67afdc23e5854a932
945            package.json       7046399bebfaf898e6d83475f1528746496da3c7034061e341e1f642b4004ee0
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