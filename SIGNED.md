##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsSDHAAoJEHNBsVwHCHesbXAIALEDQ5dDBU5Uoo9tMS1yRJcC
tGK6IN0q8BPClf/y7sQhfPnyincAWfqSkRT/SgyP4XQmVIRMUAZuIg+qBmi/BREv
uiLJB/AhXbt0ViVvybTnl+M8wa8vDwA6PpkAahfmxNWBoIl8Zzv6HC3gduF5u0sN
fPx2I2qKAZ+BgN8jgGlCx/iLhNAzJYtwhzuuWjRC+54eQUWfO4g5Nn3eugA4Po/l
jJYDqRqt+xV1rS4ScW6uL+gXZYm9u/lho7Cg2g4trwVwpI2/GGK8YtloExXBf8S7
LmLK40jgFugHamSnKRuGaf4xjWhmKi9WsQBRtIU368RvW/rbzotpwBL21eY3p3I=
=rqpu
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
9284            citgm.js    4253c53d479c581a92317cf594daaa4254d68c5240cb4738b9a375178abb420c
679           package.json  631f9877cd9ac421d221bd7cdb810bd42d45f8ca442696adc3923b8995c276ca
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