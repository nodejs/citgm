##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVs8fQAAoJEHNBsVwHCHescGMIAJGVfyTxLKIXqYWREVs3cYAX
4r4yriRhBjl265nkXxENd+jPnDhQp0hiaDYplKlD4ZvwJEqgp+Guti4HPqwH0h5n
08aZEC12dW5Znw0BbcozHBx+zxhtjYIkrvYUMVyB2TMwnsKELBgqTWBWxEskGxjK
Gu27J0OPBXm/QysVm5LPEdgb0y0MmPS2Ud0JnAmpFgHkvbeT6y5nBiBsUIR+xTFx
lyadbaLtRCIPDhmpSQ931WPF69o/DDAyozJ9SQEVYoG0jPE0uQjAZ0PKp/UIWcxm
aczwCbu2wmMEzApVjJk7OEVkNDDpGeAZqn6hjVkAReN3Kpvf8UDNSubMA992bO4=
=N09F
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
1647   x         citgm            892f0b91df0e56e8cef52545718c50e5a2985a4779a6a9c889f46305ad3f1eec
7696   x         citgm-dockerify  70b4e5ae17c722cc3627b600926ff3e5a22e58f1cce67629bceffde0d2d1dc40
               known/                                                                             
                 lodash/                                                                          
43                 lookup.json    af3ecb554661a1664a9cc10db8b26dd8ab713aa2490c81f6f055fe36f66095dc
121    x           test.js        fb292b5b5d811b68dcf2dac7ef04ff06c0ce3ebac1f38235f02d58fbebb33550
               lib/                                                                               
11237            citgm.js         64f70f94b6f3679c5d1fe5d8109095009c7957c1f48580194e705359a79d595a
2799             lookup.js        f5f951ba0b10e653ae5c6e1bb70fed4368a0f6c4cfef60c1d85a01323aaf04e5
1504             lookup.json      cd41e56055054db234d3ca06b095ea67afba3a2b23ded9b52665228d915c36e1
1505             out.js           d726c2820cca48ff7453f9e4e389160dfe7c92602aeefd17adb93789c5ea3aea
1238           LICENSE.md         1e6b09b8752ff67f0dad3899a9eb205eeabd6001fcbe210bfb122ccdb1dbda4c
945            package.json       269a3854fff84f27541e492d75a1a4e4744297fd01750f09e4333a0ab9e2f9d2
8754           README.md          1d38b58b0e94676aabfb96227567d719a5fe0d8fc977ab3df4ac51fb5422e8e6
               test/                                                                              
                 test-dir/                                                                        
26                 index.js       0e3ff6bf26b1727bdb29101212803b124fd519a2ac3c351cde3beb8d21c3118f
174                package.json   b8b4842fdcaed06b4536d6df184061bc31bb330c16b8df2d7a13bed15a5ad83f
45               test-script.js   536a80b7a731b6e45bae705ab19c91b84261a5913933bc7dd8679adc9a3fa950
1683             test.js          9da7900743b0ea0db52903ce27187e93ea09487a709f343acd4c59f1bd32215e
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