/*
@author Kay Sackey
@licence: MIT



Rationale:
Iterative logic is error prone and hard to read. See below.


    // This block of code takes an array of strings,
    // checks if each already added, returning an error if that is so,
    // or adding the tag to the existing list if that is false.
    for (let text of string_array) {
        if (existing_tags.map((ea) => ea.text)).includes(text)) {
            add_error(`${text}: this tag has already been added`);
            continue;
        }

        existing_tags.push({
            text: text
        });
    }


Functional logic using pipes is much easier to read, but restricts from branching in the middle of a pipeline.
Solution?

        let tags_as_text = this.tags.map((ea) => ea.text);

        pipeline = OnEach [
                        NotIncluded(tags_as_text),
                        {
                            ok: [
                                AddTag({text: tag_text, username: tag_text})
                            ],
                            fail: [
                                AddError(this, 'This user has already been added')
                            ]
                        }
                  ];

        Pipe.process(pipeline, this.tags.map((ea) => ea.text))




        // OnEach is simply a helper that executes a Pipe on each element of an array
        const OnEach = (input, pipeline) => input.map((ea) => (new Pipe(pipeline)).execute(ea));

        y = Pipe([
                 _ => this.tags.map((ea) => ea.text)
                 OnEach([
                    tag_text => tags_as_text.includes(tag_text),
                    res => res ? 'ok' : 'fail',
                    {
                        ok: [
                            _ => this.tags.push({text: tag_text, username: tag_text})
                        ],
                        fail: [
                            _ => this.add_error(`${tag_text}: this user has already been added`)
                        ]
                    }
                ])
            ]);




 */

// Todo: Look at this
// Normal pipe macro: https://www.bountysource.com/issues/29128366-the-polyfill
// takes many function as an argument, returns the result of piping an argument through all of them.
// let pipe = (...funcs) => (...args) => funcs.slice(1,funcs.length).reduce((v, f) => f(v), funcs[0](...args))
// const pipe = (x, ...fs) => fs.reduce((y, f) => f(y), x)
/*

https://github.com/mindeavor/es-pipeline-operator/tree/inline

function pipe(x) {
  var c = x;
  for (var y = 1; y < arguments.length; y++) {
    c = arguments[y](c, arguments[y]);
  }
  return c;
}

const pipe_operator_es7 = (arg) => {
    const length  = arguments.length;
    let clonedArg = arg;
    let func;
    for (var i = 1; i < length; i++) {
        func      = arguments[i];
        clonedArg = func(clonedArg);
    }
    return clonedArg;
};

 */


/*
	console.json({
	    'string': 'testing',
	    'boolean': true,
	    'function': function() {},
	    'number': 3123,
	    'null': null,
	    'undefined': undefined
	});
*/



const adjective = ['obnoxious', 'actually', 'giant', 'kaput', 'half', 'different', 'fluttering', 'difficult', 'cloistered', 'bumpy', 'elite', 'tranquil', 'rotten', 'dysfunctional', 'cuddly', 'gaudy', 'right', 'knowledgeable', 'ignorant', 'nondescript', 'stimulating', 'last', 'gainful', 'redundant', 'plain', 'round', 'famous', 'aberrant', 'meek', 'smooth', 'dizzy', 'wretched', 'dashing', 'selfish', 'erratic', 'familiar', 'greasy', 'limping', 'absorbed', 'frantic', 'determined', 'petite', 'fixed', 'naive', 'fast', 'sick', 'dusty', 'giddy', 'eatable', 'zonked', 'parsimonious', 'fuzzy', 'parched', 'disgusting', 'secret', 'hypnotic', 'axiomatic', 'flippant', 'greedy', 'big', 'stiff', 'male', 'shut', 'unkempt', 'ill', 'far', 'jagged', 'motionless', 'shivering', 'luscious', 'lyrical', 'previous', 'victorious', 'chubby', 'flimsy', 'wealthy', 'ruddy', 'dependent', 'exciting', 'vengeful', 'abandoned', 'ugly', 'exultant', 'stupid', 'flagrant', 'absent', 'productive', 'short', 'aboriginal', 'responsible', 'sincere', 'devilish', 'judicious', 'exclusive', 'scandalous', 'kindly', 'vivacious', 'magical', 'pushy', 'obscene'];

const noun = ['rose', 'land', 'scarecrow', 'drink', 'throat', 'channel', 'jail', 'kettle', 'sofa', 'sand', 'carpenter', 'friend', 'language', 'rate', 'tooth', 'beef', 'smoke', 'snake', 'nation', 'twist', 'sticks', 'chess', 'teaching', 'oil', 'downtown', 'rabbits', 'fruit', 'zipper', 'cars', 'finger', 'hose', 'advertisement', 'airport', 'turkey', 'whip', 'girl', 'train', 'top', 'account', 'governor', 'songs', 'match', 'fear', 'recess', 'wrench', 'crowd', 'produce', 'change', 'coil', 'pigs', 'ducks', 'ocean', 'coach', 'country', 'regret', 'quarter', 'connection', 'island', 'pollution', 'order', 'shade', 'brother', 'vacation', 'beginner', 'trousers', 'stocking', 'potato', 'lip', 'berry', 'observation', 'dress', 'cannon', 'giants', 'roof', 'servant', 'kick', 'blood', 'money', 'food', 'authority', 'flower', 'run', 'addition', 'texture', 'rice', 'grape', 'fish', 'sheep', 'quill', 'color', 'celery', 'arm', 'market', 'hydrant', 'mask', 'foot', 'view', 'reason', 'property', 'ground'];

const verb = ['curls', 'squashes', 'fastens', 'covers', 'transports', 'wishes', 'stares', 'zooms', 'teases', 'introduces', 'amuses', 'chews', 'likes', 'grins', 'confesses', 'tempts', 'annoys', 'cracks', 'ties', 'collects', 'jokes', 'blinds', 'supplies', 'crosses', 'shades', 'vanishes', 'joins', 'repairs', 'walks', 'wonders', 'hangs', 'flashes', 'worries', 'trips', 'complains', 'asks', 'pats', 'objects', 'measures', 'jumps', 'polishes', 'memorises', 'posts', 'brakes', 'telephones', 'hurries', 'strengthens', 'approves', 'washes', 'manages', 'compares', 'continues', 'fades', 'blots', 'behaves', 'performs', 'shrugs', 'suits', 'tires', 'attaches', 'detects', 'kneels', 'influences', 'whirls', 'fries', 'observes', 'moans', 'owns', 'avoids', 'bares', 'pauses', 'uses', 'completes', 'adds', 'blushes', 'sucks', 'occurs', 'improves', 'shelters', 'lands', 'causes', 'strips', 'sighs', 'bruises', 'wipes', 'discovers', 'pushes', 'impresses', 'drags', 'relaxes', 'slips', 'attempts', 'attends', 'scatters', 'punishes', 'prepares', 'traces', 'tries', 'destroys', 'care'];

/**
 * Make an ID of three words using format:
 *      Verb a Adjective Noun
 *
 * @returns {string}
 */
function makeID() {
    let a_verb       = verb[Math.floor(Math.random() * verb.length)];
    let an_adjective = adjective[Math.floor(Math.random() * adjective.length)];
    let a_noun       = noun[Math.floor(Math.random() * noun.length)];

    return `${an_adjective} ${a_noun}`;
}

/**
 * @class
 * @augments Error
 */
class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name    = this.constructor.name;
        this.message = message;
        if ( typeof Error.captureStackTrace === 'function' ) {
            Error.captureStackTrace(this, this.constructor);
        }
        else {
            this.stack = (new Error(message)).stack;
        }
    }
}
/**
 * @class
 * @augments Error
 */
class PipelineError extends ExtendableError {}
/**
 * @class
 * @augments Error
 */
class BranchingError extends PipelineError {}
/**
 * @class
 * @augments Error
 */
class AbortedPipeline extends PipelineError {}

class PipelineFSM {
    /**
     * Constructor
     * @param {Array.<*>} pipeline
     * @param {number} verbosity
     * @param {Function} errorHandler
     * @param {Function} wrapper
     */
    constructor(pipeline, verbosity = 0, errorHandler = null, wrapper = null) {
        /**
         * Array of operators to call in the FSM
         * @type {Array}
         */
        this.pipeline = pipeline || [];

        /**
         * After execution this is set to a Promise that resolves to the result of the operations
         * @type {null|Promise}
         */
        this.result = null;

        /**
         * What level of debugging statements should we print? 0 - Nothing. 3 - Everything.
         * @type {number}
         */
        this.verbosity = verbosity;

        /**
         * When null it means the FSM hasn't started executing
         * When a number it is the index of the array of pipeline operations given.
         * @type {null|number}
         */
        this.step = null;

        /**
         * Current value as evaluated by the FSM
         * @type {null}
         */
        this.current = null;

        /**
         * Name of the FSM, used mostly in debugging.
         * @type {string}
         */
        this.name = makeID();

        /**
         * Handles errors as a catch statement on the initially created result promise
         * @type {Function}
         */
        this.errorHandler = errorHandler;

        /**
         * Set to true if the pipeline is complete
         * @type {boolean}
         */
        this.done = false;

        /**
         * If the pipeline has to call a function, it will wrap it in this one first.
         * @type {Function}
         */
        this.wrapper = wrapper;

        // Private: used to restart the operations after a pause.
        // Two underscores means you shouldn't touch this externally from this class or else bad things happen :)
        // One underscore would mean you shouldn't need to but nothing bad can happen.
        this.__paused  = false;
        this.__aborted = false;

        // All of the below are resolvers or rejection functions for Promises
        this.__pause_resolve = null;
        this.__pause_promise = null;
        this.__pause_waiting = null;  // resolves the case of checking if a pipeline has paused

        this.__current_unresolved = null;
        this.__current_resolve    = null;   // Not used: maybe one day will implement skipping next steps in pipe
                                            // then forcing a particular result
        this.__current_reject     = null;
    }


    /**
     * Pause the pipeline after the current step completes.
     * Will wait for current step to compete before resolving a Promise to true.
     * Promise resolves to false if we have aborted.
     * @returns {Promise} -
     */
    pause() {
        // todo: Test
        // todo: Make pause return a promise.
        if ( this.__paused ) {
            this._log(1, "Already paused...");
            return Promise.resolve(true);
        }

        if(this.__aborted){
            this._log(1, "Already aborted...");
            return Promise.resolve(false);
        }

        this.__pause_promise = new Promise((resolve, reject) => {
            this.__pause_resolve = resolve;
            this.__pause_reject  = reject;
        });

        const result = new Promise((resolve, reject) => {
            this.__pause_waiting = resolve;
        });

        this.__paused = true;
        return result;
    }

    /**
     * Resume the pipeline if paused
     * Can resume using a new value as the current via:
     *      .resume({using: value})
     *
     *      Value will be set to current before the pipeline is restarted
     */
    resume({using: value}) {
        if ( !this.__paused ) {
            this._log(1, "Already running...");
            return;
        }

        if(this.__aborted){
            this._log(1, "Already aborted...");
            return;
        }

        if ( value != undefined ) {
            this.current = value;
        }

        this.__pause_resolve(true);
        this.__paused = false;
    }

    /**
     * Abort a running pipeline.
     * Note: Unlike say Bluebird
     */
    abort() {
        // todo: Test
        // todo: Make abort return a Promise. We can wait to see if state has aborted, then return true when it has.
        if(this.__aborted){
            this._log(1, "Already aborted...");
            return;
        }

        // Step 1.
        // If the current unresolved value is a Promise-like; and we can abort it, then we shall.
        // This will abort BlueBird promises, calling your own onAbort handler there.
        // This will also abort nested pipes that are currently running
        if ( Object.prototype.hasOwnProperty.call(this.__current_unresolved, 'abort') ) {
            this.__current_unresolved.abort();
        }

        // Step 2
        // Abort the current pipeline with a rejection
        // If your javascript environment runs Promises in separate threads; the next step in the pipeline might
        // execute. At *most* one step further will execute.
        // E.g. if your promises are running entirely in separate web workers; you'll have this issue.
        // Fix it by either having your web-worker promise implementation handle aborts (ala Step 1)
        // Or run your Pipeline in the same web-worker as everything else.
        if ( this.__current_reject ) {
            this.__current_reject(this._annotate_error(new AbortedPipeline("Aborted Pipeline")))
        }

        // Step 3. Reject paused pipelines
        if ( this.paused ) {
            this.__pause_reject(this._annotate_error(new AbortedPipeline("Aborted Pipeline")));
        }

        this.__aborted = true;
    }

    get started(){
        return this.step === null;
    }

    /**
     * Status is one of ['staging', 'running', 'illegal', 'aborted', 'paused', 'done']
     *
     *      FSM can go from
     *         staging -> [running, aborted, paused]
     *
     *              Pausing or aborting at staging will result in the completion
     *              of at least one step being completed while paused.
     *
     *         running  -> [paused, aborted, done]
     *         paused   -> [running, aborted]
     *         aborted  -> aborted
     *         done     -> done
     *
     *         illegal should never be returned, but can be if the internal variables of the pipeline are modified
     *         by an external agent.
     *
     * @returns {string}
     */
    get status(){
        if(this.staging)
          return 'initial';

        if(this.__aborted)
          return 'aborted';

        if(this.__paused)
          return 'paused';

        if(this.done || this.step === this.pipeline.length)
          return 'done';

        if(this.step < 0 || this.step > this.pipeline.length)
          return 'illegal';

        return 'running';
    }

    /**
     * Is this the initial stage.
     * @returns {boolean}
     */
    get staging(){
        return this.step === null;
    }

    /**
     * Are we running this pipeline?
     * @returns {boolean}
     */
    get running(){
        return this.status === 'running';
    }

    /**
     * Begins execution of FSM. This can only be called once. Calling it a second time will just return the ongoing
     * result promise.
     *
     * @param {*} initialValue
     * @returns {Promise}
     */
    process(initialValue) {
        if ( this.staging ) {

            this._log(2, `Process called...`);

            // Initial value might be a Promise, so we wrap it in our own promise and wait for the results to arrive
            // If initial value is a static value; we'll get them immediately
            this.step    = 0;
            this.current = null;
            let promise =
              Promise.resolve(initialValue)
                .then(this._wrap((result) => {
                                    this._log(2, `Chain at start >> `, result);
                                    this.current = result;
                                    return this.next();
                                }))
                .then(this._wrap((final) => {
                                    this._log(2, `Chain at end >> `, final);
                                    this.done = true;
                                    return final;
                                }));

            if ( this.errorHandler ) {
               promise = this.result.catch(this.errorHandler);
            }

            // Dev: Written this way so Bluebird et al, won't warn about not returning a promise
            this.result = promise;
            return promise;
        }
        else {
            this._log(1, `This pipe already started, and has run up til step ${this.step + 1} of ${this.pipeline.length}`);
            return this.result;
        }
    }

    /**
     * @protected
     * Called internally to wrap a function with another call
     * @param func
     * @returns {*}
     */
    _wrap(func){
        if(this.wrapper){
            //return this.wrapper(func)
        }

        return func;
    }

    /**
     * Move onto next step in the Promise-chain. End-users shouldn't need to call this..
     * @returns {Promise}
     */
    next() {
        this.step++;
        let operation = this.pipeline[this.step - 1];
        this.result   = new Promise((resolve, reject) => {
            this._log(3, `Next(start)  >>`, this.current);

            this.__current_resolve = resolve;
            this.__current_reject  = reject;

            try {
                // If the value resolves asynchronously, we'll return a promise that will be waited on
                let value = this.handle_single(this.current, operation);
                this.__current_unresolved = value;
                this._log(3, `Next(end) >>`, value);
                resolve(value);
            }
            catch (err) {
                // If the value resolves synchronously, we need to be able to catch errors
                reject(err)
            }
        }).then((new_value) => {
            // Update internal data in preparation for next stage
            this.current              = new_value;
            this.__current_unresolved = null;

            if ( this.step >= this.pipeline.length ) {
                // Completed pipeline. Yay!
                return new_value;
            }
            else if ( this.__paused ) {
                // We need to pause & tell the resolve our promise to pause.
                this.__pause_waiting(true);
                return this.__pause_promise.then(_ => this.next());
            }
            else if ( this.__aborted ) {
                // Should not be reached normally under V8 & Browser engines
                // Hedge against Javascript environments that run Promises in truly separate threads
                throw this._annotate_error(new AbortedPipeline("Aborted Pipeline (in next)"));
            }
            else {
                // We have more operations to process
                return this.next();
            }
        });

        return this.result;
    }

    /**
     * @protected
     * Handle a single operation in the FSM pipeline
     * @param {*} acc - the ongoing result of pipeline
     * @param operation - A single line in the pipeline representing an operation to take; it must accept/return
     *                    a single value
     * @throws {TypeError}
     *      - If an invalid pipeline was constructed
     * @returns {*}
     */
    handle_single(acc, operation) {
        this._log(3, `Handling operation >> `, acc, " with >> ", operation);

        if ( operation instanceof Function ) {
            // This is a function, so we just call it
            return this._wrap(operation(acc));
        }
        else if ( operation instanceof Array || operation === undefined || operation === null) {
            throw this._annotate_error(new PipelineError(
              `Pipe: Pipeline includes a value >> ${JSON.stringify(operation)} << that is not an object, function or pipe handler`))
        }
        else if ( operation instanceof Promise ) {
            return operation;
        }
        else if ( operation instanceof Object ) {
            if ( operation.constructor.name === 'Object' ) {
                // This is a raw object; so we treat it like a switch statement

                // The accumulated result will be used as a key for the 'switch'
                // Valid values for the key are:
                // 1. A primitive string
                // 2. An array of size 2, in [key, value] format.
                // 3. An boolean which will be converted to a string.

                let [key, value] = this._getKey(acc);

                // Execution
                // The value of the object at key must be:
                // 1. an array whose values will be treated as pipeline operations for a new FSM
                // 2. A single function that takes a singular value and returns a result.
                //    It will be executed in a new FSM.
                let newPipe;
                let pipelineBranch = operation[key];

                if ( pipelineBranch === undefined ) {
                    throw this._annotate_error(new BranchingError(
                      `Looked for a reference of >> ${key} << in an object, but could not find it. Object was >> ${operation}`),
                      {key: key, operation: operation})
                }
                else if ( pipelineBranch instanceof Function ) {
                    newPipe = PipelineFSM([pipelineBranch], this.verbosity);
                }
                else if ( pipelineBranch instanceof Array ) {
                    newPipe = new PipelineFSM(pipelineBranch, this.verbosity)
                }
                else {
                    throw this._annotate_error(new BranchingError(
                      `Expected a single function or an array of pipes in the key: ${acc}. Instead found >> ${pipelineBranch}`))
                }

                return newPipe.process(value);
            }
            else {
                // This is a regular object so we try to call .process() on it
                if ( !Object.prototype.hasOwnProperty.call(operation, 'process') ) {
                    throw this._annotate_error(new PipelineError(
                      `Branching: Received an object in key: ${acc} of type ${operation.constructor.name} ` +
                      `that did not have a property 'process' available on it.`))
                }
                else if (!(operation.process instanceof Function)) {
                    throw this._annotate_error(new PipelineError(
                      `Branching: Received an object in key: ${acc} of type ${operation.constructor.name} ` +
                      `where property of 'process' exists, but is not a callable function.`))
                }

                // This is a regular object we call process on it.
                let wrapped_process = this._wrap(operation.process);
                return wrapped_process.call(value);
            }
        }

        throw this._annotate_error(new TypeError("Sanity check! We received something that's not an object!"))
    }

    /**
     * @protected: get a key from an accumulated value
     * @returns {Array} - Format is [key, value]
     */
    _getKey(acc, depth = 1) {
        let key;
        let value;

        if ( acc instanceof Array && depth === 1 ) {
            if ( acc.length != 2 ) {
                throw this._annotate_error(new BranchingError(
                  `Pipe expected previous operation to return a sting or an array of length 2 in [key, value] format.` +
                  `Instead returned an array of >> ${JSON.stringify(acc)}`));
            }

            // Tries to transform the possible key into a real value
            // by setting depth to 2 we prevent the pathological case of infinite recessive decent from an array-like
            // nesting itself.
            key   = this._getKey(acc[0], depth + 1)[0];
            value = acc[1];
        }
        else if ( typeof acc === 'string' ) {
            key   = acc;
            value = acc;
        }
        else if ( typeof acc === "boolean" ) {
            key   = acc.toString();
            value = acc;
        }
        else {
            throw this._annotate_error(new BranchingError(
              `Pipe expected the previous operation return a string or an array of length 2 in [key, value] format,` +
              `but it instead returned object of `+(acc.constructor.name) +` >> ${JSON.stringify(acc)}`));
        }

        return [key, value];
    }


    /**
     * @protected: Annotate's errors with debugging info.
     * @param {Error} err
     * @param {object} extra
     * @returns {Error}
     */
    _annotate_error(err, extra = null) {
        err.pipe  = this;
        err.step  = this.step;
        err.extra = extra;
        return err
    }

    /**
     * @protected: Log's data given a verbosity setting
     * @param verbosity {number} : verbosity setting of message
     * @param {string} messages
     */
    _log(verbosity, ...messages) {
        if ( this.verbosity >= verbosity ) {
            let logger = console.log;
            if(verbosity === 0){
                logger = console.error || console.log;
            }
            else if(verbosity === 1){
                logger = console.warn || console.log;
            }else if(verbosity === 2){
                logger = console.info || console.log;
            }else{
                logger = console.debug || console.log;
            }

            logger(`${this.name} | ${this.step} >> `, ...messages);
        }
    }
}

/**
 * Helper function. simply maps a series of values onto an identical set of pipelines and returns the results as
 *                   promises
 *
 *                   You may want to wrap this with Promise.all or handle rejections individually in some manner.
 * @param {Array.<*>} input      - Initial Data
 * @param {Array.<*>} pipes      - Pipes to operate initial data items on
 * @returns {Array.<*>}          - Result of Pipes (as single promises)
 */
export const OnEach = (input, pipes) => input.map((ea) => Pipe(pipes).process(ea));

/**
 * Helper function to create a PipelineFSM in a short format.
 *      Usage: Pipe([...])
 *      Usage: Pipes({ pipeline: [.....], verbosity: 3, wrapper: transaction, onError: printErrorsToConsole)
 *
 * @param {object|<Array.<*>} options
 *      If an array: Expects array to include pipeline operators
 *      If an object: Reads values from object to create PipelineFSM:
 *
 *         verbosity: can be set here from 0 - 3. Default is 0 which means no console logging.
 *         onError:  An error handler to be called when the pipeline's promise fails.
 *         wrapper:   If the pipeline has to call a function, it will wrap it in this one first.
 *                     Useful if you are dealing with a client-library for state, like MobX and want to wrap your calls
 *                     in a transaction.
 *         pipeline: {Array.<t>} - An array of pipeline operations
 *
 * @returns {PipelineFSM}
 */
export const Pipe = (options) => {
    if(options instanceof Array){
        options = {pipeline: options};
    }

    let pipeline     = options.pipeline || [];
    let verbosity    = options.verbosity === undefined ? 0 : options.verbosity;
    let errorHandler = options.onError;
    let wrapper      = options.wrapper;

    return new PipelineFSM(pipeline, verbosity, errorHandler, wrapper);
};


// todo: test wrapper | pause | resume | abort functionality