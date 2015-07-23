##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsRyrAAoJEHNBsVwHCHeshFoH/0fSBhPehbEKsYPYM32wffIZ
iSlfc0z7V4lzFtoafeR/E1+QFdiSzRd45DzSKteye+8c2mLzpKBd3gDNtszKUquc
q6E25oS8NaSoAvt6gmuop7e6+7UBAZfXoB1oyeHp567VtPO8XkfdOMsr+c4YBz8y
fX5DXdIU6ETFwKelWJBZ2EdH9vi+gMJggIYEuAenRFulSkSMwnQ6OAtbiG1go4tS
/WOWMVrRLBy+UiuFhLYRaue5ZDEgJs/3zTO5sS+Qo9p1R3QKQWOunsdoC1EI9bsl
Q1Unl2HS4PDtdW4zrzE0lIkSY6ix7OJZD7IZe+Juc14zqsgyJxqDensYPgdC7U8=
=L4v9
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
9251            citgm.js    a30153d2abd9614d3550a41c29ca48737130d4f33dfed7d7cc9965c36dec8b7b
679           package.json  22458b08aaf9a75024fb822757e5eb562735859cd4bd1d472a1ad61f9d3be464
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