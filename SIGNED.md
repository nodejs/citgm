##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsGTPAAoJEHNBsVwHCHesdMwIAKXc9v9wJYR0esxeaJtREphv
fA2KygXZbs5bxe4tC6vVxu21Zcp4zCALSFnyHP0xoBd0YfWu+AifxkoW4Poxqg5g
UqGPYuU1bj6v723oeMg1YjztzpnVaNHibqe85BQNDx4NrQwhjQae/T7Ve1RZy9X7
3NHN6p0ulpUx+D6lQnHQZjmzoWhUzgUCaRQ5APo2dYmJC6Iee92Q96TpoOAnkN35
fY9PU2PYkwJpWtUCdUlf/qZzncIOZPuM/cUvOCDcg1DSQMV5VMXOYCwAd98srnZy
1l5nqC2yxtSfhdu19Wll09Jsg9rIxfXnLijk1jlWt+Gs+KPm4vobjIlL3PTQTKs=
=Swe3
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
484           package.json  65bed79bf6276429f3a76dcda5e3e62b6ae46934fb97d60784e4de7b85cffee6
350           README.md     053282281afb8859ee1904b39d9152248e49a9a2a3ff6472b462a3ab51aa1737
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