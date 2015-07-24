##### Signed by https://keybase.io/jasnell
```
-----BEGIN PGP SIGNATURE-----
Comment: GPGTools - https://gpgtools.org

iQEcBAABCgAGBQJVsdO8AAoJEHNBsVwHCHesICUH/01X+Q7zJMbU1TRXJwBpBpf6
oynhTZL5ojbaFobDO9ab1JuQA5f6Gso7Wq11rPUBxEsJskl9dzsrLGdrmr2F5f9b
YFPPDUotkgwhTOAZryHgkLsd/KT4WvUm874v5S+nd3YkV09HZZhyzduQr/snHfS8
qRhnl9b5S1GdceIsb2qgP7lNHKGAXJRtaYhVI5HowSEXvu/XfmVJ4oMoz7qDZJho
K3HcHv56Nmbl1Z/I5yVVDevCljRjo4L+xFdF2zEqoH19tY8HPv6jBihqSt3IZ7uM
gywsaWIwMLZUIITeP+8Y02TH/NcepZYYHRw6TN2T5PnUZvEhx+kLicEfWasUww4=
=Ogv+
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
1466   x         citgm       06497c247dea2de96ad1a6cc2e4f0477ac4dce4e957997ec6c334d7ada77d070
               known/                                                                        
                 lodash/                                                                     
123    x           test.js   dca87bee9bc057b642eda9f0ae059cc245a7b7a81e63809221e7a59f4aca644f
               lib/                                                                          
10661            citgm.js    15fb6fde027397fb8e825ed729d56e64406d2353475605a2cd5a47c5264aa16e
741            package.json  8abc25bba543a6e57b3b39dc849b55c59460b19abd507f32a8520a380c16a253
4818           README.md     54d632b710a625b7236966a0db4a645cde7f7e0014d1406659ad8716b6a8304a
               test/                                                                         
488              test.js     03eafa6de5e62fb7ac981672fbf352843b8c69fd74f5a618be00883be7ed2873
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