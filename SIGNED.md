##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsS/fAAoJEHNBsVwHCHesS9gH/3AevLc8Ne+bfDdtL8JlHDZN
X08SuyoPOJvFEb/9osWxyi9XnzgBymgDv6JgvLZAmtQXFwpLHQ1JWcSadp2n8XW1
/ANDk684pNDhZuj2BlyQmxPloBSie3oF/x+qByqod/Ab93+WvIMqksR7q3UK4Ujc
Vi4Iined4PS90gwreFJQuqZNAAIeWPggT+7+jfMQjLBR63GdpPobtu/SXaHWTpIC
Uq7COjPgrK/Q6SGnI+JEs1Tz5m9UxnNLDdISutjqY81lPYslpgu+g5KxRfb1y/AS
BqgU2wPxEBcgtx9LvUag6RATrdksVC1XAh8WuWFM8sN8OPC+KJIUoDe+hOoGZOQ=
=nUsd
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
1466  x         citgm       a4dc99f995ad0823170a9dc58689755f980ecc9e4dd71c69ee274dc05cd05d41
              known/                                                                        
                lodash/                                                                     
123   x           test.js   dca87bee9bc057b642eda9f0ae059cc245a7b7a81e63809221e7a59f4aca644f
              lib/                                                                          
8618            citgm.js    c78f7fe82db96bc02770d5e0d1d6a89e06f001d6d99b73ec90581e5a2d2899b4
679           package.json  55e4f409e8d3cf27e1d8cce40283ca11dd3c0f26ac3498b81416f939bfb66d14
1080          README.md     9809a749fef999bbcdc0d593a7213ecade281ba50f3fd9fbb8471b1f4d380276
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