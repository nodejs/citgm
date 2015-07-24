##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsqjSAAoJEHNBsVwHCHes9YMIAJovBQlq/jhOwEh+GOwiGCYZ
9R6/BK46ytOXubx+eXwR9UvffQPQUpASYPjCl0o6bi9/38MVIV87LWSYGkn6PmCa
gwHeBHejAwx6I7MvJk5kj0lG7yabVnv1YG3tV48Q4RW8zPkdgBPPGVBXUX9uGiZq
pIyLR70MFqrtGxDwr5Y+junykMKVRpsizNFHVlqBHfUtgX79eh8cbl6RAV7o4FKM
hbclropD/9UAvPR824iEhHBf4I2iSPYPw5+P9C7gXocbrBXMZ6DUuosiFKl6Ip5Z
RjU4ZkDuOHjY1xh7lv5alqgIhxOAvYvv0wy5KOjYkG76esyUs+J6zNwbHyAqmng=
=VtbN
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
1647   x         citgm            762fa862d16b0106dbd4768c3cf72bae12ea3f2421b79e80d4983f8590fa2102
4000   x         citgm-dockerify  4ad04ea50f713f0fe5c0ae3dda95eaf9f616a83d822fe103837dd6945e39a9de
               known/                                                                             
                 lodash/                                                                          
121    x           test.js        fb292b5b5d811b68dcf2dac7ef04ff06c0ce3ebac1f38235f02d58fbebb33550
               lib/                                                                               
11126            citgm.js         e8e73a6e0d61ebdfdda591c9ca2a2b7e7e8c4c36dc0cfb65fcf83472be5939c3
2824             lookup.js        cd28d33fb5de865a203ea9717287cb0daa6407ec17b18d9c99d244a14db5c243
1504             lookup.json      cd41e56055054db234d3ca06b095ea67afba3a2b23ded9b52665228d915c36e1
1505             out.js           d726c2820cca48ff7453f9e4e389160dfe7c92602aeefd17adb93789c5ea3aea
1238           LICENSE.md         1e6b09b8752ff67f0dad3899a9eb205eeabd6001fcbe210bfb122ccdb1dbda4c
893            package.json       1acb3d5c0f24d30b0f2c0d92d36a52fe7f5fcba4ab7a11ddaa06f1d70499fa18
8311           README.md          c5e56a33c2c1eec5ef03b55d731c338f14ed19e1a18b43a33e4e0bd068dd1748
               test/                                                                              
488              test.js          03eafa6de5e62fb7ac981672fbf352843b8c69fd74f5a618be00883be7ed2873
               tmp/                                                                               
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