/**
 * This is the code part of the Alexa Skill Schiffsbegrüßung
 * Author: Selamanse <selamanse@scheinfrei.info>
 *
 **/

'use strict'

const AWS = require('aws-sdk')
const Alexa = require('ask-sdk-core')
const helper = require('./lib/helper.js')
const moment = require('moment')
const skillBuilder = Alexa.SkillBuilders.custom();

const APP_ID = 'amzn1.ask.skill.0dd13499-e6e1-452e-95ea-f4e509ad8ff7'

const messages = {
  'skillName': 'Alexa Schiffsbegrüßungsanlage',
  welcome: ' <audio src="https://s3-eu-west-1.amazonaws.com/skillstuff/seagull.mp3" /> Moin <emphasis level="moderate">Moin</emphasis> und Ahoi! Bei der Alexa Schiffsbegrüßungsanlage!',
  help: 'Du kannst dir Namen von Schiffen ausgeben lassen die gerade im Hamburger-Hafen einlaufen, indem Du sagst "Alexa frage Hamburg Hafen welches Schiff läuft ein"',
  reprompt: 'Kannst Du das bitte wiederholen?',
  stop: 'Tschüss, bis zum nächsten mal!'
}

/* INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === `LaunchRequest`;
  },
  handle(handlerInput) {
    const response = handlerInput.responseBuilder;
    
    return response.speak(`${messages.welcome} ${messages.help}`)
      .reprompt(messages.help)
      .getResponse();
  }
};

const GetIncomingShipsHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    console.log("Inside GetIncomingShipsHandler");
    console.log(JSON.stringify(request));
    return request.type === "IntentRequest" &&
           request.intent.name === "GetIncomingShips";
  },
  async handle(handlerInput) {
    console.log("Inside GetIncomingShipsHandler - handle");
    const request = handlerInput.requestEnvelope.request;
    const response = handlerInput.responseBuilder;
    console.log('Tryblock')
    let outputSpeech = '';
    
    try {
      
      const shipName = await helper.getFirstPassengerShipName()
      console.dir(shipName)
      outputSpeech = `Derzeit läuft das Schiff ${shipName} im Hamburger Hafen ein.`
      return response
        .speak(outputSpeech)
        .withSimpleCard(outputSpeech , 'Ahoi!')
        .getResponse();
    }catch (error) {
      outputSpeech = `Es tut mir leid. Es gab einen Fehler bei der Abfrage der Anzahl der Produkte im Shop ${shopEnvironment}`;
      console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
    }
    
    return response
      .speak(outputSpeech)
      .withSimpleCard(SKILL_NAME, card)
      .getResponse();
  }
};

const GetShipStateHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    console.log("Inside GetShipStateHandler");
    console.log(JSON.stringify(request));
    return request.type === "IntentRequest" &&
           request.intent.name === "GetShipState";
  },
  async handle(handlerInput) {
    console.log("Inside GetShipStateHandler - handle");
    const request = handlerInput.requestEnvelope.request;
    const response = handlerInput.responseBuilder;
    
    let schiffsname = request.intent.slots.schiffsname
    if (schiffsname && schiffsname.value) {
      console.log(`user wants to get info for ship ${schiffsname.value}`)
    } else {
      console.log(`user didnt say ship name.`)
      return response
      .speak('Entschuldige, welches Schiff meinst du?')
      .getResponse();
    }

    let outputSpeech = '';
    
    try {
      
      const shipInfo = await helper.getPassengerShipByName(schiffsname.value)
      console.dir(shipInfo)
      switch(shipInfo.properties.actiontype){
        case 'MOORED':
          outputSpeech = `Das Schiff ${shipInfo.properties.name} hat angelegt.`
          break
        case 'MOVING':
          outputSpeech = `Das Schiff ${shipInfo.properties.name} bewegt sich mit ${shipInfo.properties.speed} Knoten`
          if('' !== shipInfo.properties.destination){
            outputSpeech += ` in Richtung ${shipInfo.properties.destination} `
          }
          break
        default:
          outputSpeech = `Das Schiff ${shipInfo.properties.name} hat den Status ${shipInfo.properties.actiontype}.`
         break
      }

      
      return response
        .speak(outputSpeech)
        .withSimpleCard(outputSpeech , 'Ahoi!')
        .getResponse();
    }catch (error) {
      outputSpeech = `Es tut mir leid. Es gab einen Fehler bei der Abfrage der Anzahl der Produkte im Shop ${shopEnvironment}`;
      console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
    }
    
    return response
      .speak(outputSpeech)
      .withSimpleCard(SKILL_NAME, card)
      .getResponse();
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    console.log("Inside HelpHandler");
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
           request.intent.name === 'AMAZON.HelpHandler';
  },
  handle(handlerInput) {
    console.log("Inside HelpHandler - handle");
    return handlerInput.responseBuilder
      .speak(messages.help)
      .reprompt(messages.reprompt)
      .getResponse();
  }
};

const ExitHandler = {
  canHandle(handlerInput) {
    console.log("Inside ExitHandler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return request.type === `IntentRequest` && (
              request.intent.name === 'AMAZON.StopIntent' ||
              request.intent.name === 'AMAZON.CancelIntent'
           );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.stop)
      .withShouldEndSession(true)
      .getResponse();
  }
};


const ErrorHandler = {
  canHandle() {
    console.log("Inside ErrorHandler");
    return true;
  },
  handle(handlerInput, error) {
    console.log("Inside ErrorHandler - handle");
    console.log(`Error handled: ${JSON.stringify(error)}`);
    console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);

    return handlerInput.responseBuilder
      .speak('Tut mir leid. Versuche es nochmal!')
      .getResponse();
  },
};

/* LAMBDA SETUP */
module.exports.handle = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetIncomingShipsHandler,
    GetShipStateHandler,
    HelpHandler,
    ExitHandler
  )
  .withSkillId(APP_ID)
  .addErrorHandlers(ErrorHandler)
  .lambda();
