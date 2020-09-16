/**
 * @file This file exports a function with some syntactic sugar to replace the ugly try/catch block needed to use async/await.
 * Use it as a wrapper for  any function that requires a try/catch block.
 * @author Joseph <obochi2@gmail.com> <02/09/2020 4:09am>
 * @since 0.1.0
 * Everytime you make changes to this file ensure to change the name, date and time
 * Last Modified: Joseph <obochi2@gmail> <date & time eg 09/15/2020 4:40pm>
 */

module.exports = (execution) => (req, res, next) => {
    execution(req, res, next).catch(next)
}