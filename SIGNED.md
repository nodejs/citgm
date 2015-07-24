##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsod/AAoJEHNBsVwHCHes8bkH/2RIbLb3eKx0PkL+m1yAdXOD
a/LJ6aUeJqmO1juaHUrcSM504kn5bLWamcbIRg6MajkUKB4h99o2Mrlz/TVKsDS+
x/bYP6QPAt0EGnd44d4KtFuLFOOkcz5DYHMsWh8KQn315Nm9kSAV9cYJnjkyiWZk
bvuK1JHdiGOH4w+EkTHkSO6oqvTzgSBhYrZ6ylDf2FDrcz5QmOjodBUnhKjzc0MU
qI9ORnfEOnBleTnh/uAlduPLYuEcH3tpE8rMhRhcuZiOmCFr/Afj4Ps9I2D0azRh
eVstzWfem9dLDp2B2vEQcVV7wobPt3MQP4njmVBvhTmiHzt2tbz60DCP0BNepYk=
=B3FK
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size   exec  file             contents                                                        
             ./                                                                               
13             .gitignore     16d30e4462189fb14dd611bdb708c510630c576a1f35b9383e89a4352da36c97
19             .jshintrc      d862dcf6091929f90429363ddf72864c1076a22e9f2673f35552a05ba056ce49
               bin/                                                                           
1647   x         citgm        dcf624562c1556d89675a3b8da6c19db095633ada9b70e2b376132749449a67b
               known/                                                                         
                 lodash/                                                                      
121    x           test.js    fb292b5b5d811b68dcf2dac7ef04ff06c0ce3ebac1f38235f02d58fbebb33550
               lib/                                                                           
11126            citgm.js     e8e73a6e0d61ebdfdda591c9ca2a2b7e7e8c4c36dc0cfb65fcf83472be5939c3
2824             lookup.js    cd28d33fb5de865a203ea9717287cb0daa6407ec17b18d9c99d244a14db5c243
1504             lookup.json  cd41e56055054db234d3ca06b095ea67afba3a2b23ded9b52665228d915c36e1
1505             out.js       d726c2820cca48ff7453f9e4e389160dfe7c92602aeefd17adb93789c5ea3aea
1238           LICENSE.md     1e6b09b8752ff67f0dad3899a9eb205eeabd6001fcbe210bfb122ccdb1dbda4c
845            package.json   80bda1701bc80ac04d26afdb7461f045854917bd058a8354b8c65567d40ca60c
7141           README.md      10dd5921483f6b70d0146a6db24c2ddd9f718e71f10234ab249c9584701cf85f
               test/                                                                          
488              test.js      03eafa6de5e62fb7ac981672fbf352843b8c69fd74f5a618be00883be7ed2873
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