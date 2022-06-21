const { twiml } = require('twilio');
const twilio = require('twilio');
const VoiceResponse = require('twilio/lib/twiml/VoiceResponse');

class Twilio{
     phoneNumber = '+19704451226';
     phoneNumberSid = 'PNc14562be57805eee8220c5225ff33101';
     tokenSid  = 'SK0f626e57a05e876f73af2325eda417de';
     tokenSecret ='4tHMuffLZRmS7yUeClsJSSRUbH7sbAOZ';
     accountSid = 'ACfad375f9c9b70b3f63e8d072c8a2ba47';
     verify = 'VAda2f7517954e0293bb82121513c772d7';
     client;
     constructor(){
        this.client = twilio(this.tokenSid, this.tokenSecret, {
            accountSid:this.accountSid
        });
     }
     getTwilio() {
         this.client;
     }
     async sendVerifyAsync(to, channel){
         const data = await this.client.verify.services(this.verify).verifications.create({
             to,
             channel
         });
         console.log('sendVerify');
         return data;
     }
     async verifyCodeAsync(to, code){   
         const data = await this.client.verify
         .services(this.verify)
         .verificationChecks.create({
             to,
             code
         });
         console.log('VerifyCode');
         return data;
     }

     voiceResponse(message){
        const twiml = new VoiceResponse();
        twiml.say({
            voice: 'woman',
            language: 'en-IN'
        }, message);
        
        
        twiml.redirect('https://rdigs.loca.lt/enqueue');
        return twiml;
     }

     enqueueCall(){
         const twiml = new VoiceResponse();
         twiml.enqueue();
         return twiml;
     }
}

const instance = new Twilio();
Object.freeze(instance);

module.exports = instance