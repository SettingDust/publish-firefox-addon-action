# Publish Firefox Addon

## Usage
```yaml
- uses: SettingDust/publish-firefox-addon-action@master
  with:
    addonId: ghostery # slug, guid or number id
    jwtIssuer: ${{ secrets.FIREFOX_JWT_ISSUER }} # Such as user:000000:00
    jwtSecret: ${{ secrets.FIREFOX_JWT_SECRET }}
    addonFile: dist/web-ext-artifacts/addon.zip
    sourceFile: src.zip
    channel: unlisted # Optional, default is listed. Should be listed or unlisted
```
