##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVs9R9AAoJEHNBsVwHCHesQisH/RiJ7PT/bU6OpLGE0GqHAiEb
ajfjIv7In0lIf0hdccsfCwk2kcvF6mJRiOdUPsvMIEBwWljE1CLN856/iCbXnkxC
mVP1oiqAVj1hG95vXJ+bWc0YheCjfLl7gWYMF2nz+xePpqhn8S0Ajptu9II9GzUk
6k14SZVi0M+9W8KQprQaN1RUu0YlGBBK9v4Sgsx5gOFYAUXZeG4mZi9DX6HhKHQM
eeK4iKpdK3DPpd1duNC3JjuJde3AXh+lj0dvdg4guPpt44ZJcT7NDE91wKJR2Yqc
fne6UuQcs/5ykHN8OTPGZwr8t2Jgpp8kGHq0K7EXseCST2otLQ1bpBELOUzfAeE=
=SH6y
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
54             AUTHORS            47bb87633797121247b7c831c6090ddc32f3e7b91072914a7035398a3dd738b1
               bin/                                                                               
1647   x         citgm            bb9ebb4281d1e3c6bb9d2835199a35e7b419eb6a246421bda6da2db6ed8ab05b
7696   x         citgm-dockerify  dd3b36a77f4e84d513ba78d4a0adcca52cdf2f592780229c7b41007958b64e56
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
               man/                                                                               
2509             citgm.1          e7362eb6932819600b489f8eba2700d6eff40778b25e3f034a4f9f0993ef1fd3
2510             dockerify.1      d3d072b551bf511b992c86def24e7c8acb84965245e4cee025d78a35b525169b
1177           package.json       f9408c5530b7e16a3f13c26c09d6f1041424e4f3a84cdeffe112685cb7eb74c4
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