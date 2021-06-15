function getEmail(link) {
    var confirmation_link = link;
    return `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="x-apple-disable-message-reformatting">
            <title></title>
            <style>
                table,
                td,
                div,
                h1,
                p {
                    font-family: Arial, sans-serif;
                }
        
                .email-header {
                    padding: 40px 0 30px 0;
                    background: #222;
                }
        
                .email-header img {
                    border-radius: 50%;
                    width: 250px;
                    height: 250px;
                    /* height: auto; */
                    display: block;
                }
        
                .table-role-presentation1 {
                    width: 100%;
                    border-collapse: collapse;
                    border: 0;
                    border-spacing: 0;
                    background: #ffffff;
                }
        
                .table-role-presentation2 {
                    width: 702px;
                    border-collapse: collapse;
                    border: 1px solid #cccccc;
                    border-spacing: 0;
                    text-align: left;
                }
        
                .table-role-presentation3 {
                    width: 100%;
                    border-collapse: collapse;
                    border: 0;
                    border-spacing: 0;
                }
        
                .table-role-presentation4 {
                    width: 100%;
                    border-collapse: collapse;
                    border: 0;
                    border-spacing: 0;
                    font-size: 9px;
                    font-family: Arial, sans-serif;
                }
        
                .table-role-presentation5 {
                    border-collapse: collapse;
                    border: 0;
                    border-spacing: 0;
                }
        
                .main-paragraph {
                    padding: 0 0 36px 0;
                    color: #3d3d3d;
                }
        
                .main-paragraph title {
                    font-size: 24px;
                    margin: 0 0 20px 0;
                    font-family: Arial, sans-serif;
                }
        
                .main-paragraph image {
                    margin: 0 0 25px 0;
                    font-size: 16px;
                    line-height: 24px;
                    font-family: Arial, sans-serif;
                }
        
                .main-paragraph body {
                    margin: 0 0 12px 0;
                    font-size: 16px;
                    line-height: 24px;
                    font-family: Arial, sans-serif;
                }
        
                .main-paragraph link {
                    margin: 0;
                    font-size: 16px;
                    line-height: 24px;
                    font-family: Arial, sans-serif;
                }
        
                a {
                    color: #33ad48;
                    text-decoration: underline;
                }
        
                .email-footer {
                    padding: 30px;
                    background: #222;
                }
        
                .email-footer-text-container {
                    padding: 0;
                    width: 50%;
                }
        
                .email-footer-text-container p {
                    margin: 0;
                    font-size: 14px;
                    line-height: 16px;
                    font-family: Arial, sans-serif;
                    color: #ffffff;
                }
            </style>
        </head>
        
        <body style="margin:0; padding:0;">
            <table role="presentation" class="table-role-presentation1">
                <tr>
                    <td align="center" style="padding:0;">
                        <table role="presentation" class="table-role-presentation2">
                            <tr>
                                <td align="center" class="email-header">
                                    <img src="https://phoneauth.it/phone_logo.png" alt="" width="300" />
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:36px 30px 42px 30px;">
                                    <table role="presentation" class="table-role-presentation3">
                                        <tr>
                                            <td class="main-paragraph">
                                                <h1 class="title">Confirm your registration to phoneauth</h1>
                                                <p class="body">Here's a list of informations that will help you understant what happened to your data:</p>
                                                <ul>
                                                    <li>Your password is encrypted and super securely stored on my database, so noone will now the original one</li>
                                                    <li>Your email is stored on the database (as every site with registration will do)</li>
                                                    <li>Your licenses and IP's are encrypted and stored inside a secondary database made just for them</li>
                                                    <li>Your connection is secure (https) so noone will get your data and steal your credentials</li>
                                                    <li>Every session for the dashboard will last only for 30 minutes for security reasons</li>
                                                </ul>
                                                <p class="body">Here's a list of informations related to the phone purchasing:</p>
                                                <ul>
                                                    <li>The price of the zth_phone is 120 euros.</li>
                                                    <li>The script is provided deobfuscated (excluding the authentication files) and protected by IP lock.</li>
                                                    <li>Non-obfuscated configs are provided to customize the experience as needed.</li>
                                                    <li>The phone was tested on a clean install of Plume ESX (a template provided by txAdmin). Installation support will be provided, however implementation support on other different ESX frameworks / versions is not provided. You can find the PlumeESX <a href="https://forum.cfx.re/t/recipe-plumeesx-full-base-2021/1964029">here</a></li></li>
                                                    <li>Future updates will be free.</li>
                                                    <li>Custom implementations for specific frameworks may be requested (with the payment of a supplement), however it is not said that it will be provided (it will be evaluated according to the situation); so before purchasing please check that you meet the requirement for the ESX version.</li>
                                                    <li>The phone license is linked to the server and not to a person or ip.</li>
                                                    <li>This phone is written using a secure event creation system with auto generated ids at every server start / restart, making event calls super secure</li>
                                                    <li>No refounds will be given to anyone in any case</li>
                                                </ul>
                                                <p class="link"><a href="https://phoneauth.it/c/:${confirmation_link}">Complete registration</a></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td class="email-footer">
                                    <table role="presentation" class="table-role-presentation4">
                                        <tr>
                                            <td class="email-footer-text-container" align="left">
                                                <p>
                                                    &reg; Made with ❤️ by zThundy__
                                                </p>
                                            </td>
                                            <td class="email-footer-text-container" align="right">
                                                <table role="presentation" class="table-role-presentation5">
                                                    <tr>
                                                        <td style="padding:0 0 0 10px;width:38px;">
                                                            <a href="https://discord.gg/VABdfWEPAR" style="color:#ffffff;"><img src="https://phoneauth.it/discord_logo.png" alt="Discord" width="38" style="height:auto;display:block;border:0;" /></a>
                                                        </td>
                                                        <td style="padding:0 0 0 10px;width:38px;">
                                                            <a href="https://www.twitch.tv/zthundy__" style="color:#ffffff;"><img src="https://phoneauth.it/twitch_logo.png" alt="Twitch" width="38" style="height:auto;display:block;border:0;" /></a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        
        </html>
    `
}

module.exports = getEmail;