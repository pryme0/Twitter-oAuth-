/**
 * @file This file handles all events subscription using the default Node JS emitter module
 * @author Joseph <obochi@gmail.com>
 * @since 0.1.0
 * Last Modified: Joseph <obochi2@gmail.com> <--15/08/2020 5:04pm>
 */

const EventEmitter = require('events');
const EmailService = require('../Services/EmailService');

const emitter = new EventEmitter();

emitter.on('sendWelcomeEmail', async(user, url) => {
    try {
        console.log('event captured')
        let booster = await new EmailService(user, url).sendWelcome();
    } catch (err) {
        console.log(err);
    }
});

emitter.on('passwordRecovery', async(user, url) => {
    try {
        await new EmailService(url).passwordRecovery();
    } catch (err) {
        console.log(err);
    }
});

module.exports = emitter;