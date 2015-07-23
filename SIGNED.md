##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsUdqAAoJEHNBsVwHCHesh+cH/1ZazkQakaERH2BCmvagwBMt
n8MqAR7PiGh8n6SOlkzIIysqUpj5WG53KODHKrOrWvI4WiUopFDF4ooJK2XBiCFa
F14v2MFnasi2JLLpZn51VomjQXHtdWRfTdfcbrBGKsIz/YPvUoQWGOpmaRP6xU4Q
T/6Zz9/1Lz0rSDs/9U0t2jT5Yn3ubPplSWgXjIGy0WuVsFfczFSUZ0G80DdTyEpQ
E9XUYu4tExD9p2H4r1b/Uo4TVprJkOkR9eIwnOi4W4clX1t9OKrNkqVd74MoQqnL
Rfkn1FQyhtUJqTo22IJ+XYfBwhHUGE4BQIzdcO7wUMCOxN+w6V7XkpiRRn0/SU4=
=JcIu
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size   exec  file            contents                                                        
             ./                                                                              
13             .gitignore    16d30e4462189fb14dd611bdb708c510630c576a1f35b9383e89a4352da36c97
19             .jshintrc     d862dcf6091929f90429363ddf72864c1076a22e9f2673f35552a05ba056ce49
               bin/                                                                          
1555   x         citgm       879f1ab8fb08c94726736fc69cbe54ef3e5b405e3bfd3f703808b59911986f63
               known/                                                                        
                 lodash/                                                                     
123    x           test.js   dca87bee9bc057b642eda9f0ae059cc245a7b7a81e63809221e7a59f4aca644f
               lib/                                                                          
10480            citgm.js    ca47c45d54168b27b4287fd880f91fdc2b82aa2a2c47a4202443defa55a0b110
705            package.json  f3b4e0bc468e35cf756ca65558ee84a66f4bc5eef0b484ea45f2d1235dcadea6
1763           README.md     e4dd650abdc43fd5871f21a727b7639d28106b94165495c5f4bb20aba4cc8a8a
               test/                                                                         
441              test.js     d31b6d84d9cf1252883c0dd1d2a4d2055c2a25e300430a80320eeba088f9791b
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