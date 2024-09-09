import { QueryObject } from 'ufo';
import { Hooks, AdapterOptions } from 'crossws';
import { IncomingMessage, ServerResponse } from 'node:http';
export { IncomingMessage as NodeIncomingMessage, ServerResponse as NodeServerResponse } from 'node:http';
import { CookieSerializeOptions } from 'cookie-es';
import { SealOptions } from 'iron-webcrypto';
import { Readable } from 'node:stream';

type NodeListener = (req: IncomingMessage, res: ServerResponse) => void;
type NodePromisifiedHandler = (req: IncomingMessage, res: ServerResponse) => Promise<any>;
type NodeMiddleware = (req: IncomingMessage, res: ServerResponse, next: (err?: Error) => any) => any;
declare const defineNodeListener: (handler: NodeListener) => NodeListener;
declare const defineNodeMiddleware: (middleware: NodeMiddleware) => NodeMiddleware;
declare function fromNodeMiddleware(handler: NodeListener | NodeMiddleware): EventHandler;
declare function toNodeListener(app: App): NodeListener;
declare function promisifyNodeListener(handler: NodeListener | NodeMiddleware): NodePromisifiedHandler;
declare function callNodeListener(handler: NodeMiddleware, req: IncomingMessage, res: ServerResponse): Promise<unknown>;

interface NodeEventContext {
    req: IncomingMessage & {
        originalUrl?: string;
    };
    res: ServerResponse;
}
interface WebEventContext {
    request?: Request;
    url?: URL;
}
declare class H3Event<_RequestT extends EventHandlerRequest = EventHandlerRequest> implements Pick<FetchEvent, "respondWith"> {
    "__is_event__": boolean;
    node: NodeEventContext;
    web?: WebEventContext;
    context: H3EventContext;
    _method?: HTTPMethod;
    _path?: string;
    _headers?: Headers;
    _requestBody?: BodyInit;
    _handled: boolean;
    _onBeforeResponseCalled: boolean | undefined;
    _onAfterResponseCalled: boolean | undefined;
    constructor(req: IncomingMessage, res: ServerResponse);
    get method(): HTTPMethod;
    get path(): string;
    get headers(): Headers;
    get handled(): boolean;
    respondWith(response: Response | PromiseLike<Response>): Promise<void>;
    toString(): string;
    toJSON(): string;
    /** @deprecated Please use `event.node.req` instead. */
    get req(): IncomingMessage & {
        originalUrl?: string;
    };
    /** @deprecated Please use `event.node.res` instead. */
    get res(): ServerResponse<IncomingMessage>;
}
/**
 * Checks if the input is an H3Event object.
 * @param input - The input to check.
 * @returns True if the input is an H3Event object, false otherwise.
 * @see H3Event
 */
declare function isEvent(input: any): input is H3Event;
/**
 * Creates a new H3Event instance from the given Node.js request and response objects.
 * @param req - The NodeIncomingMessage object.
 * @param res - The NodeServerResponse object.
 * @returns A new H3Event instance.
 * @see H3Event
 */
declare function createEvent(req: IncomingMessage, res: ServerResponse): H3Event;

declare function defineEventHandler<Request extends EventHandlerRequest = EventHandlerRequest, Response = EventHandlerResponse>(handler: EventHandler<Request, Response> | EventHandlerObject<Request, Response>): EventHandler<Request, Response>;
declare function defineEventHandler<Request = EventHandlerRequest, Response = EventHandlerResponse>(handler: EventHandler<Request extends EventHandlerRequest ? Request : EventHandlerRequest, Request extends EventHandlerRequest ? Response : Request>): EventHandler<Request extends EventHandlerRequest ? Request : EventHandlerRequest, Request extends EventHandlerRequest ? Response : Request>;
declare const eventHandler: typeof defineEventHandler;
declare function defineRequestMiddleware<Request extends EventHandlerRequest = EventHandlerRequest>(fn: _RequestMiddleware<Request>): _RequestMiddleware<Request>;
declare function defineResponseMiddleware<Request extends EventHandlerRequest = EventHandlerRequest>(fn: _ResponseMiddleware<Request>): _ResponseMiddleware<Request>;
/**
 * Checks if any kind of input is an event handler.
 * @param input The input to check.
 * @returns True if the input is an event handler, false otherwise.
 */
declare function isEventHandler(input: any): input is EventHandler;
declare function toEventHandler(input: any, _?: any, _route?: string): EventHandler;
interface DynamicEventHandler extends EventHandler {
    set: (handler: EventHandler) => void;
}
declare function dynamicEventHandler(initial?: EventHandler): DynamicEventHandler;
declare function defineLazyEventHandler<T extends LazyEventHandler>(factory: T): Awaited<ReturnType<T>>;
declare const lazyEventHandler: typeof defineLazyEventHandler;

/**
 * @deprecated Please use native web Headers
 * https://developer.mozilla.org/en-US/docs/Web/API/Headers
 */
declare const H3Headers: {
    new (init?: HeadersInit): Headers;
    prototype: Headers;
};
/**
 * @deprecated Please use native web Response
 * https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
declare const H3Response: {
    new (body?: BodyInit | null, init?: ResponseInit): Response;
    prototype: Response;
    error(): Response;
    json(data: any, init?: ResponseInit): Response;
    redirect(url: string | URL, status?: number): Response;
};

type SessionDataT = Record<string, any>;
type SessionData<T extends SessionDataT = SessionDataT> = T;
declare const getSessionPromise: unique symbol;
interface Session<T extends SessionDataT = SessionDataT> {
    id: string;
    createdAt: number;
    data: SessionData<T>;
    [getSessionPromise]?: Promise<Session<T>>;
}
interface SessionConfig {
    /** Private key used to encrypt session tokens */
    password: string;
    /** Session expiration time in seconds */
    maxAge?: number;
    /** default is h3 */
    name?: string;
    /** Default is secure, httpOnly, / */
    cookie?: false | CookieSerializeOptions;
    /** Default is x-h3-session / x-{name}-session */
    sessionHeader?: false | string;
    seal?: SealOptions;
    crypto?: Crypto;
    /** Default is Crypto.randomUUID */
    generateId?: () => string;
}
/**
 * Create a session manager for the current request.
 *
 */
declare function useSession<T extends SessionDataT = SessionDataT>(event: H3Event, config: SessionConfig): Promise<{
    readonly id: string | undefined;
    readonly data: T;
    update: (update: SessionUpdate<T>) => Promise<any>;
    clear: () => Promise<any>;
}>;
/**
 * Get the session for the current request.
 */
declare function getSession<T extends SessionDataT = SessionDataT>(event: H3Event, config: SessionConfig): Promise<Session<T>>;
type SessionUpdate<T extends SessionDataT = SessionDataT> = Partial<SessionData<T>> | ((oldData: SessionData<T>) => Partial<SessionData<T>> | undefined);
/**
 * Update the session data for the current request.
 */
declare function updateSession<T extends SessionDataT = SessionDataT>(event: H3Event, config: SessionConfig, update?: SessionUpdate<T>): Promise<Session<T>>;
/**
 * Encrypt and sign the session data for the current request.
 */
declare function sealSession<T extends SessionDataT = SessionDataT>(event: H3Event, config: SessionConfig): Promise<string>;
/**
 * Decrypt and verify the session data for the current request.
 */
declare function unsealSession(_event: H3Event, config: SessionConfig, sealed: string): Promise<Partial<Session<SessionDataT>>>;
/**
 * Clear the session data for the current request.
 */
declare function clearSession(event: H3Event, config: Partial<SessionConfig>): Promise<void>;

type RouterMethod = Lowercase<HTTPMethod>;
type RouterUse = (path: string, handler: EventHandler, method?: RouterMethod | RouterMethod[]) => Router;
type AddRouteShortcuts = Record<RouterMethod, RouterUse>;
interface Router extends AddRouteShortcuts {
    add: RouterUse;
    use: RouterUse;
    handler: EventHandler;
}
interface RouteNode {
    handlers: Partial<Record<RouterMethod | "all", EventHandler>>;
    path: string;
}
interface CreateRouterOptions {
    /** @deprecated Please use `preemptive` instead. */
    preemtive?: boolean;
    preemptive?: boolean;
}
/**
 * Create a new h3 router instance.
 */
declare function createRouter(opts?: CreateRouterOptions): Router;

type AnyString = string & {};
type AnyNumber = number & {};

type ValidateResult<T> = T | true | false | void;
type ValidateFunction<T> = (data: unknown) => ValidateResult<T> | Promise<ValidateResult<T>>;

type MimeType = 'application/1d-interleaved-parityfec' | 'application/3gpdash-qoe-report+xml' | 'application/3gppHal+json' | 'application/3gppHalForms+json' | 'application/3gpp-ims+xml' | 'application/A2L' | 'application/ace+cbor' | 'application/ace+json' | 'application/activemessage' | 'application/activity+json' | 'application/aif+cbor' | 'application/aif+json' | 'application/alto-cdni+json' | 'application/alto-cdnifilter+json' | 'application/alto-costmap+json' | 'application/alto-costmapfilter+json' | 'application/alto-directory+json' | 'application/alto-endpointprop+json' | 'application/alto-endpointpropparams+json' | 'application/alto-endpointcost+json' | 'application/alto-endpointcostparams+json' | 'application/alto-error+json' | 'application/alto-networkmapfilter+json' | 'application/alto-networkmap+json' | 'application/alto-propmap+json' | 'application/alto-propmapparams+json' | 'application/alto-tips+json' | 'application/alto-tipsparams+json' | 'application/alto-updatestreamcontrol+json' | 'application/alto-updatestreamparams+json' | 'application/AML' | 'application/andrew-inset' | 'application/applefile' | 'application/at+jwt' | 'application/ATF' | 'application/ATFX' | 'application/atom+xml' | 'application/atomcat+xml' | 'application/atomdeleted+xml' | 'application/atomicmail' | 'application/atomsvc+xml' | 'application/atsc-dwd+xml' | 'application/atsc-dynamic-event-message' | 'application/atsc-held+xml' | 'application/atsc-rdt+json' | 'application/atsc-rsat+xml' | 'application/ATXML' | 'application/auth-policy+xml' | 'application/automationml-aml+xml' | 'application/automationml-amlx+zip' | 'application/bacnet-xdd+zip' | 'application/batch-SMTP' | 'application/beep+xml' | 'application/c2pa' | 'application/calendar+json' | 'application/calendar+xml' | 'application/call-completion' | 'application/CALS-1840' | 'application/captive+json' | 'application/cbor' | 'application/cbor-seq' | 'application/cccex' | 'application/ccmp+xml' | 'application/ccxml+xml' | 'application/cda+xml' | 'application/CDFX+XML' | 'application/cdmi-capability' | 'application/cdmi-container' | 'application/cdmi-domain' | 'application/cdmi-object' | 'application/cdmi-queue' | 'application/cdni' | 'application/CEA' | 'application/cea-2018+xml' | 'application/cellml+xml' | 'application/cfw' | 'application/cid-edhoc+cbor-seq' | 'application/city+json' | 'application/clr' | 'application/clue_info+xml' | 'application/clue+xml' | 'application/cms' | 'application/cnrp+xml' | 'application/coap-group+json' | 'application/coap-payload' | 'application/commonground' | 'application/concise-problem-details+cbor' | 'application/conference-info+xml' | 'application/cpl+xml' | 'application/cose' | 'application/cose-key' | 'application/cose-key-set' | 'application/cose-x509' | 'application/csrattrs' | 'application/csta+xml' | 'application/CSTAdata+xml' | 'application/csvm+json' | 'application/cwl' | 'application/cwl+json' | 'application/cwt' | 'application/cybercash' | 'application/dash+xml' | 'application/dash-patch+xml' | 'application/dashdelta' | 'application/davmount+xml' | 'application/dca-rft' | 'application/DCD' | 'application/dec-dx' | 'application/dialog-info+xml' | 'application/dicom' | 'application/dicom+json' | 'application/dicom+xml' | 'application/DII' | 'application/DIT' | 'application/dns' | 'application/dns+json' | 'application/dns-message' | 'application/dots+cbor' | 'application/dpop+jwt' | 'application/dskpp+xml' | 'application/dssc+der' | 'application/dssc+xml' | 'application/dvcs' | 'application/ecmascript' | 'application/edhoc+cbor-seq' | 'application/EDI-consent' | 'application/EDIFACT' | 'application/EDI-X12' | 'application/efi' | 'application/elm+json' | 'application/elm+xml' | 'application/EmergencyCallData.cap+xml' | 'application/EmergencyCallData.Comment+xml' | 'application/EmergencyCallData.Control+xml' | 'application/EmergencyCallData.DeviceInfo+xml' | 'application/EmergencyCallData.eCall.MSD' | 'application/EmergencyCallData.LegacyESN+json' | 'application/EmergencyCallData.ProviderInfo+xml' | 'application/EmergencyCallData.ServiceInfo+xml' | 'application/EmergencyCallData.SubscriberInfo+xml' | 'application/EmergencyCallData.VEDS+xml' | 'application/emma+xml' | 'application/emotionml+xml' | 'application/encaprtp' | 'application/epp+xml' | 'application/epub+zip' | 'application/eshop' | 'application/example' | 'application/exi' | 'application/expect-ct-report+json' | 'application/express' | 'application/fastinfoset' | 'application/fastsoap' | 'application/fdf' | 'application/fdt+xml' | 'application/fhir+json' | 'application/fhir+xml' | 'application/fits' | 'application/flexfec' | 'application/font-sfnt' | 'application/font-tdpfr' | 'application/font-woff' | 'application/framework-attributes+xml' | 'application/geo+json' | 'application/geo+json-seq' | 'application/geopackage+sqlite3' | 'application/geoxacml+json' | 'application/geoxacml+xml' | 'application/gltf-buffer' | 'application/gml+xml' | 'application/gzip' | 'application/H224' | 'application/held+xml' | 'application/hl7v2+xml' | 'application/http' | 'application/hyperstudio' | 'application/ibe-key-request+xml' | 'application/ibe-pkg-reply+xml' | 'application/ibe-pp-data' | 'application/iges' | 'application/im-iscomposing+xml' | 'application/index' | 'application/index.cmd' | 'application/index.obj' | 'application/index.response' | 'application/index.vnd' | 'application/inkml+xml' | 'application/IOTP' | 'application/ipfix' | 'application/ipp' | 'application/ISUP' | 'application/its+xml' | 'application/java-archive' | 'application/javascript' | 'application/jf2feed+json' | 'application/jose' | 'application/jose+json' | 'application/jrd+json' | 'application/jscalendar+json' | 'application/jscontact+json' | 'application/json' | 'application/json-patch+json' | 'application/json-seq' | 'application/jsonpath' | 'application/jwk+json' | 'application/jwk-set+json' | 'application/jwt' | 'application/kpml-request+xml' | 'application/kpml-response+xml' | 'application/ld+json' | 'application/lgr+xml' | 'application/link-format' | 'application/linkset' | 'application/linkset+json' | 'application/load-control+xml' | 'application/logout+jwt' | 'application/lost+xml' | 'application/lostsync+xml' | 'application/lpf+zip' | 'application/LXF' | 'application/mac-binhex40' | 'application/macwriteii' | 'application/mads+xml' | 'application/manifest+json' | 'application/marc' | 'application/marcxml+xml' | 'application/mathematica' | 'application/mathml+xml' | 'application/mathml-content+xml' | 'application/mathml-presentation+xml' | 'application/mbms-associated-procedure-description+xml' | 'application/mbms-deregister+xml' | 'application/mbms-envelope+xml' | 'application/mbms-msk-response+xml' | 'application/mbms-msk+xml' | 'application/mbms-protection-description+xml' | 'application/mbms-reception-report+xml' | 'application/mbms-register-response+xml' | 'application/mbms-register+xml' | 'application/mbms-schedule+xml' | 'application/mbms-user-service-description+xml' | 'application/mbox' | 'application/media_control+xml' | 'application/media-policy-dataset+xml' | 'application/mediaservercontrol+xml' | 'application/merge-patch+json' | 'application/metalink4+xml' | 'application/mets+xml' | 'application/MF4' | 'application/mikey' | 'application/mipc' | 'application/missing-blocks+cbor-seq' | 'application/mmt-aei+xml' | 'application/mmt-usd+xml' | 'application/mods+xml' | 'application/moss-keys' | 'application/moss-signature' | 'application/mosskey-data' | 'application/mosskey-request' | 'application/mp21' | 'application/mp4' | 'application/mpeg4-generic' | 'application/mpeg4-iod' | 'application/mpeg4-iod-xmt' | 'application/mrb-consumer+xml' | 'application/mrb-publish+xml' | 'application/msc-ivr+xml' | 'application/msc-mixer+xml' | 'application/msword' | 'application/mud+json' | 'application/multipart-core' | 'application/mxf' | 'application/n-quads' | 'application/n-triples' | 'application/nasdata' | 'application/news-checkgroups' | 'application/news-groupinfo' | 'application/news-transmission' | 'application/nlsml+xml' | 'application/node' | 'application/nss' | 'application/oauth-authz-req+jwt' | 'application/oblivious-dns-message' | 'application/ocsp-request' | 'application/ocsp-response' | 'application/octet-stream' | 'application/ODA' | 'application/odm+xml' | 'application/ODX' | 'application/oebps-package+xml' | 'application/ogg' | 'application/ohttp-keys' | 'application/opc-nodeset+xml' | 'application/oscore' | 'application/oxps' | 'application/p21' | 'application/p21+zip' | 'application/p2p-overlay+xml' | 'application/parityfec' | 'application/passport' | 'application/patch-ops-error+xml' | 'application/pdf' | 'application/PDX' | 'application/pem-certificate-chain' | 'application/pgp-encrypted' | 'application/pgp-keys' | 'application/pgp-signature' | 'application/pidf-diff+xml' | 'application/pidf+xml' | 'application/pkcs10' | 'application/pkcs7-mime' | 'application/pkcs7-signature' | 'application/pkcs8' | 'application/pkcs8-encrypted' | 'application/pkcs12' | 'application/pkix-attr-cert' | 'application/pkix-cert' | 'application/pkix-crl' | 'application/pkix-pkipath' | 'application/pkixcmp' | 'application/pls+xml' | 'application/poc-settings+xml' | 'application/postscript' | 'application/ppsp-tracker+json' | 'application/private-token-issuer-directory' | 'application/private-token-request' | 'application/private-token-response' | 'application/problem+json' | 'application/problem+xml' | 'application/provenance+xml' | 'application/prs.alvestrand.titrax-sheet' | 'application/prs.cww' | 'application/prs.cyn' | 'application/prs.hpub+zip' | 'application/prs.implied-document+xml' | 'application/prs.implied-executable' | 'application/prs.implied-object+json' | 'application/prs.implied-object+json-seq' | 'application/prs.implied-object+yaml' | 'application/prs.implied-structure' | 'application/prs.nprend' | 'application/prs.plucker' | 'application/prs.rdf-xml-crypt' | 'application/prs.vcfbzip2' | 'application/prs.xsf+xml' | 'application/pskc+xml' | 'application/pvd+json' | 'application/rdf+xml' | 'application/route-apd+xml' | 'application/route-s-tsid+xml' | 'application/route-usd+xml' | 'application/QSIG' | 'application/raptorfec' | 'application/rdap+json' | 'application/reginfo+xml' | 'application/relax-ng-compact-syntax' | 'application/remote-printing' | 'application/reputon+json' | 'application/resource-lists-diff+xml' | 'application/resource-lists+xml' | 'application/rfc+xml' | 'application/riscos' | 'application/rlmi+xml' | 'application/rls-services+xml' | 'application/rpki-checklist' | 'application/rpki-ghostbusters' | 'application/rpki-manifest' | 'application/rpki-publication' | 'application/rpki-roa' | 'application/rpki-updown' | 'application/rtf' | 'application/rtploopback' | 'application/rtx' | 'application/samlassertion+xml' | 'application/samlmetadata+xml' | 'application/sarif-external-properties+json' | 'application/sarif+json' | 'application/sbe' | 'application/sbml+xml' | 'application/scaip+xml' | 'application/scim+json' | 'application/scvp-cv-request' | 'application/scvp-cv-response' | 'application/scvp-vp-request' | 'application/scvp-vp-response' | 'application/sdp' | 'application/secevent+jwt' | 'application/senml-etch+cbor' | 'application/senml-etch+json' | 'application/senml-exi' | 'application/senml+cbor' | 'application/senml+json' | 'application/senml+xml' | 'application/sensml-exi' | 'application/sensml+cbor' | 'application/sensml+json' | 'application/sensml+xml' | 'application/sep-exi' | 'application/sep+xml' | 'application/session-info' | 'application/set-payment' | 'application/set-payment-initiation' | 'application/set-registration' | 'application/set-registration-initiation' | 'application/SGML' | 'application/sgml-open-catalog' | 'application/shf+xml' | 'application/sieve' | 'application/simple-filter+xml' | 'application/simple-message-summary' | 'application/simpleSymbolContainer' | 'application/sipc' | 'application/slate' | 'application/smil' | 'application/smil+xml' | 'application/smpte336m' | 'application/soap+fastinfoset' | 'application/soap+xml' | 'application/sparql-query' | 'application/spdx+json' | 'application/sparql-results+xml' | 'application/spirits-event+xml' | 'application/sql' | 'application/srgs' | 'application/srgs+xml' | 'application/sru+xml' | 'application/ssml+xml' | 'application/stix+json' | 'application/swid+cbor' | 'application/swid+xml' | 'application/tamp-apex-update' | 'application/tamp-apex-update-confirm' | 'application/tamp-community-update' | 'application/tamp-community-update-confirm' | 'application/tamp-error' | 'application/tamp-sequence-adjust' | 'application/tamp-sequence-adjust-confirm' | 'application/tamp-status-query' | 'application/tamp-status-response' | 'application/tamp-update' | 'application/tamp-update-confirm' | 'application/taxii+json' | 'application/td+json' | 'application/tei+xml' | 'application/TETRA_ISI' | 'application/thraud+xml' | 'application/timestamp-query' | 'application/timestamp-reply' | 'application/timestamped-data' | 'application/tlsrpt+gzip' | 'application/tlsrpt+json' | 'application/tm+json' | 'application/tnauthlist' | 'application/token-introspection+jwt' | 'application/trickle-ice-sdpfrag' | 'application/trig' | 'application/ttml+xml' | 'application/tve-trigger' | 'application/tzif' | 'application/tzif-leap' | 'application/ulpfec' | 'application/urc-grpsheet+xml' | 'application/urc-ressheet+xml' | 'application/urc-targetdesc+xml' | 'application/urc-uisocketdesc+xml' | 'application/vcard+json' | 'application/vcard+xml' | 'application/vemmi' | 'application/vnd.1000minds.decision-model+xml' | 'application/vnd.1ob' | 'application/vnd.3gpp.5gnas' | 'application/vnd.3gpp.access-transfer-events+xml' | 'application/vnd.3gpp.bsf+xml' | 'application/vnd.3gpp.crs+xml' | 'application/vnd.3gpp.current-location-discovery+xml' | 'application/vnd.3gpp.GMOP+xml' | 'application/vnd.3gpp.gtpc' | 'application/vnd.3gpp.interworking-data' | 'application/vnd.3gpp.lpp' | 'application/vnd.3gpp.mc-signalling-ear' | 'application/vnd.3gpp.mcdata-affiliation-command+xml' | 'application/vnd.3gpp.mcdata-info+xml' | 'application/vnd.3gpp.mcdata-msgstore-ctrl-request+xml' | 'application/vnd.3gpp.mcdata-payload' | 'application/vnd.3gpp.mcdata-regroup+xml' | 'application/vnd.3gpp.mcdata-service-config+xml' | 'application/vnd.3gpp.mcdata-signalling' | 'application/vnd.3gpp.mcdata-ue-config+xml' | 'application/vnd.3gpp.mcdata-user-profile+xml' | 'application/vnd.3gpp.mcptt-affiliation-command+xml' | 'application/vnd.3gpp.mcptt-floor-request+xml' | 'application/vnd.3gpp.mcptt-info+xml' | 'application/vnd.3gpp.mcptt-location-info+xml' | 'application/vnd.3gpp.mcptt-mbms-usage-info+xml' | 'application/vnd.3gpp.mcptt-regroup+xml' | 'application/vnd.3gpp.mcptt-service-config+xml' | 'application/vnd.3gpp.mcptt-signed+xml' | 'application/vnd.3gpp.mcptt-ue-config+xml' | 'application/vnd.3gpp.mcptt-ue-init-config+xml' | 'application/vnd.3gpp.mcptt-user-profile+xml' | 'application/vnd.3gpp.mcvideo-affiliation-command+xml' | 'application/vnd.3gpp.mcvideo-affiliation-info+xml' | 'application/vnd.3gpp.mcvideo-info+xml' | 'application/vnd.3gpp.mcvideo-location-info+xml' | 'application/vnd.3gpp.mcvideo-mbms-usage-info+xml' | 'application/vnd.3gpp.mcvideo-regroup+xml' | 'application/vnd.3gpp.mcvideo-service-config+xml' | 'application/vnd.3gpp.mcvideo-transmission-request+xml' | 'application/vnd.3gpp.mcvideo-ue-config+xml' | 'application/vnd.3gpp.mcvideo-user-profile+xml' | 'application/vnd.3gpp.mid-call+xml' | 'application/vnd.3gpp.ngap' | 'application/vnd.3gpp.pfcp' | 'application/vnd.3gpp.pic-bw-large' | 'application/vnd.3gpp.pic-bw-small' | 'application/vnd.3gpp.pic-bw-var' | 'application/vnd.3gpp-prose-pc3a+xml' | 'application/vnd.3gpp-prose-pc3ach+xml' | 'application/vnd.3gpp-prose-pc3ch+xml' | 'application/vnd.3gpp-prose-pc8+xml' | 'application/vnd.3gpp-prose+xml' | 'application/vnd.3gpp.s1ap' | 'application/vnd.3gpp.seal-group-doc+xml' | 'application/vnd.3gpp.seal-info+xml' | 'application/vnd.3gpp.seal-location-info+xml' | 'application/vnd.3gpp.seal-mbms-usage-info+xml' | 'application/vnd.3gpp.seal-network-QoS-management-info+xml' | 'application/vnd.3gpp.seal-ue-config-info+xml' | 'application/vnd.3gpp.seal-unicast-info+xml' | 'application/vnd.3gpp.seal-user-profile-info+xml' | 'application/vnd.3gpp.sms' | 'application/vnd.3gpp.sms+xml' | 'application/vnd.3gpp.srvcc-ext+xml' | 'application/vnd.3gpp.SRVCC-info+xml' | 'application/vnd.3gpp.state-and-event-info+xml' | 'application/vnd.3gpp.ussd+xml' | 'application/vnd.3gpp.vae-info+xml' | 'application/vnd.3gpp-v2x-local-service-information' | 'application/vnd.3gpp2.bcmcsinfo+xml' | 'application/vnd.3gpp2.sms' | 'application/vnd.3gpp2.tcap' | 'application/vnd.3gpp.v2x' | 'application/vnd.3lightssoftware.imagescal' | 'application/vnd.3M.Post-it-Notes' | 'application/vnd.accpac.simply.aso' | 'application/vnd.accpac.simply.imp' | 'application/vnd.acm.addressxfer+json' | 'application/vnd.acm.chatbot+json' | 'application/vnd.acucobol' | 'application/vnd.acucorp' | 'application/vnd.adobe.flash.movie' | 'application/vnd.adobe.formscentral.fcdt' | 'application/vnd.adobe.fxp' | 'application/vnd.adobe.partial-upload' | 'application/vnd.adobe.xdp+xml' | 'application/vnd.aether.imp' | 'application/vnd.afpc.afplinedata' | 'application/vnd.afpc.afplinedata-pagedef' | 'application/vnd.afpc.cmoca-cmresource' | 'application/vnd.afpc.foca-charset' | 'application/vnd.afpc.foca-codedfont' | 'application/vnd.afpc.foca-codepage' | 'application/vnd.afpc.modca' | 'application/vnd.afpc.modca-cmtable' | 'application/vnd.afpc.modca-formdef' | 'application/vnd.afpc.modca-mediummap' | 'application/vnd.afpc.modca-objectcontainer' | 'application/vnd.afpc.modca-overlay' | 'application/vnd.afpc.modca-pagesegment' | 'application/vnd.age' | 'application/vnd.ah-barcode' | 'application/vnd.ahead.space' | 'application/vnd.airzip.filesecure.azf' | 'application/vnd.airzip.filesecure.azs' | 'application/vnd.amadeus+json' | 'application/vnd.amazon.mobi8-ebook' | 'application/vnd.americandynamics.acc' | 'application/vnd.amiga.ami' | 'application/vnd.amundsen.maze+xml' | 'application/vnd.android.ota' | 'application/vnd.anki' | 'application/vnd.anser-web-certificate-issue-initiation' | 'application/vnd.antix.game-component' | 'application/vnd.apache.arrow.file' | 'application/vnd.apache.arrow.stream' | 'application/vnd.apache.thrift.binary' | 'application/vnd.apache.thrift.compact' | 'application/vnd.apache.thrift.json' | 'application/vnd.apexlang' | 'application/vnd.api+json' | 'application/vnd.aplextor.warrp+json' | 'application/vnd.apothekende.reservation+json' | 'application/vnd.apple.installer+xml' | 'application/vnd.apple.keynote' | 'application/vnd.apple.mpegurl' | 'application/vnd.apple.numbers' | 'application/vnd.apple.pages' | 'application/vnd.arastra.swi' | 'application/vnd.aristanetworks.swi' | 'application/vnd.artisan+json' | 'application/vnd.artsquare' | 'application/vnd.astraea-software.iota' | 'application/vnd.audiograph' | 'application/vnd.autopackage' | 'application/vnd.avalon+json' | 'application/vnd.avistar+xml' | 'application/vnd.balsamiq.bmml+xml' | 'application/vnd.banana-accounting' | 'application/vnd.bbf.usp.error' | 'application/vnd.bbf.usp.msg' | 'application/vnd.bbf.usp.msg+json' | 'application/vnd.balsamiq.bmpr' | 'application/vnd.bekitzur-stech+json' | 'application/vnd.belightsoft.lhzd+zip' | 'application/vnd.belightsoft.lhzl+zip' | 'application/vnd.bint.med-content' | 'application/vnd.biopax.rdf+xml' | 'application/vnd.blink-idb-value-wrapper' | 'application/vnd.blueice.multipass' | 'application/vnd.bluetooth.ep.oob' | 'application/vnd.bluetooth.le.oob' | 'application/vnd.bmi' | 'application/vnd.bpf' | 'application/vnd.bpf3' | 'application/vnd.businessobjects' | 'application/vnd.byu.uapi+json' | 'application/vnd.bzip3' | 'application/vnd.cab-jscript' | 'application/vnd.canon-cpdl' | 'application/vnd.canon-lips' | 'application/vnd.capasystems-pg+json' | 'application/vnd.cendio.thinlinc.clientconf' | 'application/vnd.century-systems.tcp_stream' | 'application/vnd.chemdraw+xml' | 'application/vnd.chess-pgn' | 'application/vnd.chipnuts.karaoke-mmd' | 'application/vnd.ciedi' | 'application/vnd.cinderella' | 'application/vnd.cirpack.isdn-ext' | 'application/vnd.citationstyles.style+xml' | 'application/vnd.claymore' | 'application/vnd.cloanto.rp9' | 'application/vnd.clonk.c4group' | 'application/vnd.cluetrust.cartomobile-config' | 'application/vnd.cluetrust.cartomobile-config-pkg' | 'application/vnd.cncf.helm.chart.content.v1.tar+gzip' | 'application/vnd.cncf.helm.chart.provenance.v1.prov' | 'application/vnd.cncf.helm.config.v1+json' | 'application/vnd.coffeescript' | 'application/vnd.collabio.xodocuments.document' | 'application/vnd.collabio.xodocuments.document-template' | 'application/vnd.collabio.xodocuments.presentation' | 'application/vnd.collabio.xodocuments.presentation-template' | 'application/vnd.collabio.xodocuments.spreadsheet' | 'application/vnd.collabio.xodocuments.spreadsheet-template' | 'application/vnd.collection.doc+json' | 'application/vnd.collection+json' | 'application/vnd.collection.next+json' | 'application/vnd.comicbook-rar' | 'application/vnd.comicbook+zip' | 'application/vnd.commerce-battelle' | 'application/vnd.commonspace' | 'application/vnd.coreos.ignition+json' | 'application/vnd.cosmocaller' | 'application/vnd.contact.cmsg' | 'application/vnd.crick.clicker' | 'application/vnd.crick.clicker.keyboard' | 'application/vnd.crick.clicker.palette' | 'application/vnd.crick.clicker.template' | 'application/vnd.crick.clicker.wordbank' | 'application/vnd.criticaltools.wbs+xml' | 'application/vnd.cryptii.pipe+json' | 'application/vnd.crypto-shade-file' | 'application/vnd.cryptomator.encrypted' | 'application/vnd.cryptomator.vault' | 'application/vnd.ctc-posml' | 'application/vnd.ctct.ws+xml' | 'application/vnd.cups-pdf' | 'application/vnd.cups-postscript' | 'application/vnd.cups-ppd' | 'application/vnd.cups-raster' | 'application/vnd.cups-raw' | 'application/vnd.curl' | 'application/vnd.cyan.dean.root+xml' | 'application/vnd.cybank' | 'application/vnd.cyclonedx+json' | 'application/vnd.cyclonedx+xml' | 'application/vnd.d2l.coursepackage1p0+zip' | 'application/vnd.d3m-dataset' | 'application/vnd.d3m-problem' | 'application/vnd.dart' | 'application/vnd.data-vision.rdz' | 'application/vnd.datalog' | 'application/vnd.datapackage+json' | 'application/vnd.dataresource+json' | 'application/vnd.dbf' | 'application/vnd.debian.binary-package' | 'application/vnd.dece.data' | 'application/vnd.dece.ttml+xml' | 'application/vnd.dece.unspecified' | 'application/vnd.dece.zip' | 'application/vnd.denovo.fcselayout-link' | 'application/vnd.desmume.movie' | 'application/vnd.dir-bi.plate-dl-nosuffix' | 'application/vnd.dm.delegation+xml' | 'application/vnd.dna' | 'application/vnd.document+json' | 'application/vnd.dolby.mobile.1' | 'application/vnd.dolby.mobile.2' | 'application/vnd.doremir.scorecloud-binary-document' | 'application/vnd.dpgraph' | 'application/vnd.dreamfactory' | 'application/vnd.drive+json' | 'application/vnd.dtg.local' | 'application/vnd.dtg.local.flash' | 'application/vnd.dtg.local.html' | 'application/vnd.dvb.ait' | 'application/vnd.dvb.dvbisl+xml' | 'application/vnd.dvb.dvbj' | 'application/vnd.dvb.esgcontainer' | 'application/vnd.dvb.ipdcdftnotifaccess' | 'application/vnd.dvb.ipdcesgaccess' | 'application/vnd.dvb.ipdcesgaccess2' | 'application/vnd.dvb.ipdcesgpdd' | 'application/vnd.dvb.ipdcroaming' | 'application/vnd.dvb.iptv.alfec-base' | 'application/vnd.dvb.iptv.alfec-enhancement' | 'application/vnd.dvb.notif-aggregate-root+xml' | 'application/vnd.dvb.notif-container+xml' | 'application/vnd.dvb.notif-generic+xml' | 'application/vnd.dvb.notif-ia-msglist+xml' | 'application/vnd.dvb.notif-ia-registration-request+xml' | 'application/vnd.dvb.notif-ia-registration-response+xml' | 'application/vnd.dvb.notif-init+xml' | 'application/vnd.dvb.pfr' | 'application/vnd.dvb.service' | 'application/vnd.dxr' | 'application/vnd.dynageo' | 'application/vnd.dzr' | 'application/vnd.easykaraoke.cdgdownload' | 'application/vnd.ecip.rlp' | 'application/vnd.ecdis-update' | 'application/vnd.eclipse.ditto+json' | 'application/vnd.ecowin.chart' | 'application/vnd.ecowin.filerequest' | 'application/vnd.ecowin.fileupdate' | 'application/vnd.ecowin.series' | 'application/vnd.ecowin.seriesrequest' | 'application/vnd.ecowin.seriesupdate' | 'application/vnd.efi.img' | 'application/vnd.efi.iso' | 'application/vnd.eln+zip' | 'application/vnd.emclient.accessrequest+xml' | 'application/vnd.enliven' | 'application/vnd.enphase.envoy' | 'application/vnd.eprints.data+xml' | 'application/vnd.epson.esf' | 'application/vnd.epson.msf' | 'application/vnd.epson.quickanime' | 'application/vnd.epson.salt' | 'application/vnd.epson.ssf' | 'application/vnd.ericsson.quickcall' | 'application/vnd.erofs' | 'application/vnd.espass-espass+zip' | 'application/vnd.eszigno3+xml' | 'application/vnd.etsi.aoc+xml' | 'application/vnd.etsi.asic-s+zip' | 'application/vnd.etsi.asic-e+zip' | 'application/vnd.etsi.cug+xml' | 'application/vnd.etsi.iptvcommand+xml' | 'application/vnd.etsi.iptvdiscovery+xml' | 'application/vnd.etsi.iptvprofile+xml' | 'application/vnd.etsi.iptvsad-bc+xml' | 'application/vnd.etsi.iptvsad-cod+xml' | 'application/vnd.etsi.iptvsad-npvr+xml' | 'application/vnd.etsi.iptvservice+xml' | 'application/vnd.etsi.iptvsync+xml' | 'application/vnd.etsi.iptvueprofile+xml' | 'application/vnd.etsi.mcid+xml' | 'application/vnd.etsi.mheg5' | 'application/vnd.etsi.overload-control-policy-dataset+xml' | 'application/vnd.etsi.pstn+xml' | 'application/vnd.etsi.sci+xml' | 'application/vnd.etsi.simservs+xml' | 'application/vnd.etsi.timestamp-token' | 'application/vnd.etsi.tsl+xml' | 'application/vnd.etsi.tsl.der' | 'application/vnd.eu.kasparian.car+json' | 'application/vnd.eudora.data' | 'application/vnd.evolv.ecig.profile' | 'application/vnd.evolv.ecig.settings' | 'application/vnd.evolv.ecig.theme' | 'application/vnd.exstream-empower+zip' | 'application/vnd.exstream-package' | 'application/vnd.ezpix-album' | 'application/vnd.ezpix-package' | 'application/vnd.f-secure.mobile' | 'application/vnd.fastcopy-disk-image' | 'application/vnd.familysearch.gedcom+zip' | 'application/vnd.fdsn.mseed' | 'application/vnd.fdsn.seed' | 'application/vnd.ffsns' | 'application/vnd.ficlab.flb+zip' | 'application/vnd.filmit.zfc' | 'application/vnd.fints' | 'application/vnd.firemonkeys.cloudcell' | 'application/vnd.FloGraphIt' | 'application/vnd.fluxtime.clip' | 'application/vnd.font-fontforge-sfd' | 'application/vnd.framemaker' | 'application/vnd.freelog.comic' | 'application/vnd.frogans.fnc' | 'application/vnd.frogans.ltf' | 'application/vnd.fsc.weblaunch' | 'application/vnd.fujifilm.fb.docuworks' | 'application/vnd.fujifilm.fb.docuworks.binder' | 'application/vnd.fujifilm.fb.docuworks.container' | 'application/vnd.fujifilm.fb.jfi+xml' | 'application/vnd.fujitsu.oasys' | 'application/vnd.fujitsu.oasys2' | 'application/vnd.fujitsu.oasys3' | 'application/vnd.fujitsu.oasysgp' | 'application/vnd.fujitsu.oasysprs' | 'application/vnd.fujixerox.ART4' | 'application/vnd.fujixerox.ART-EX' | 'application/vnd.fujixerox.ddd' | 'application/vnd.fujixerox.docuworks' | 'application/vnd.fujixerox.docuworks.binder' | 'application/vnd.fujixerox.docuworks.container' | 'application/vnd.fujixerox.HBPL' | 'application/vnd.fut-misnet' | 'application/vnd.futoin+cbor' | 'application/vnd.futoin+json' | 'application/vnd.fuzzysheet' | 'application/vnd.genomatix.tuxedo' | 'application/vnd.genozip' | 'application/vnd.gentics.grd+json' | 'application/vnd.gentoo.catmetadata+xml' | 'application/vnd.gentoo.ebuild' | 'application/vnd.gentoo.eclass' | 'application/vnd.gentoo.gpkg' | 'application/vnd.gentoo.manifest' | 'application/vnd.gentoo.xpak' | 'application/vnd.gentoo.pkgmetadata+xml' | 'application/vnd.geo+json' | 'application/vnd.geocube+xml' | 'application/vnd.geogebra.file' | 'application/vnd.geogebra.slides' | 'application/vnd.geogebra.tool' | 'application/vnd.geometry-explorer' | 'application/vnd.geonext' | 'application/vnd.geoplan' | 'application/vnd.geospace' | 'application/vnd.gerber' | 'application/vnd.globalplatform.card-content-mgt' | 'application/vnd.globalplatform.card-content-mgt-response' | 'application/vnd.gmx' | 'application/vnd.gnu.taler.exchange+json' | 'application/vnd.gnu.taler.merchant+json' | 'application/vnd.google-earth.kml+xml' | 'application/vnd.google-earth.kmz' | 'application/vnd.gov.sk.e-form+xml' | 'application/vnd.gov.sk.e-form+zip' | 'application/vnd.gov.sk.xmldatacontainer+xml' | 'application/vnd.gpxsee.map+xml' | 'application/vnd.grafeq' | 'application/vnd.gridmp' | 'application/vnd.groove-account' | 'application/vnd.groove-help' | 'application/vnd.groove-identity-message' | 'application/vnd.groove-injector' | 'application/vnd.groove-tool-message' | 'application/vnd.groove-tool-template' | 'application/vnd.groove-vcard' | 'application/vnd.hal+json' | 'application/vnd.hal+xml' | 'application/vnd.HandHeld-Entertainment+xml' | 'application/vnd.hbci' | 'application/vnd.hc+json' | 'application/vnd.hcl-bireports' | 'application/vnd.hdt' | 'application/vnd.heroku+json' | 'application/vnd.hhe.lesson-player' | 'application/vnd.hp-HPGL' | 'application/vnd.hp-hpid' | 'application/vnd.hp-hps' | 'application/vnd.hp-jlyt' | 'application/vnd.hp-PCL' | 'application/vnd.hp-PCLXL' | 'application/vnd.hsl' | 'application/vnd.httphone' | 'application/vnd.hydrostatix.sof-data' | 'application/vnd.hyper-item+json' | 'application/vnd.hyper+json' | 'application/vnd.hyperdrive+json' | 'application/vnd.hzn-3d-crossword' | 'application/vnd.ibm.afplinedata' | 'application/vnd.ibm.electronic-media' | 'application/vnd.ibm.MiniPay' | 'application/vnd.ibm.modcap' | 'application/vnd.ibm.rights-management' | 'application/vnd.ibm.secure-container' | 'application/vnd.iccprofile' | 'application/vnd.ieee.1905' | 'application/vnd.igloader' | 'application/vnd.imagemeter.folder+zip' | 'application/vnd.imagemeter.image+zip' | 'application/vnd.immervision-ivp' | 'application/vnd.immervision-ivu' | 'application/vnd.ims.imsccv1p1' | 'application/vnd.ims.imsccv1p2' | 'application/vnd.ims.imsccv1p3' | 'application/vnd.ims.lis.v2.result+json' | 'application/vnd.ims.lti.v2.toolconsumerprofile+json' | 'application/vnd.ims.lti.v2.toolproxy.id+json' | 'application/vnd.ims.lti.v2.toolproxy+json' | 'application/vnd.ims.lti.v2.toolsettings+json' | 'application/vnd.ims.lti.v2.toolsettings.simple+json' | 'application/vnd.informedcontrol.rms+xml' | 'application/vnd.infotech.project' | 'application/vnd.infotech.project+xml' | 'application/vnd.informix-visionary' | 'application/vnd.innopath.wamp.notification' | 'application/vnd.insors.igm' | 'application/vnd.intercon.formnet' | 'application/vnd.intergeo' | 'application/vnd.intertrust.digibox' | 'application/vnd.intertrust.nncp' | 'application/vnd.intu.qbo' | 'application/vnd.intu.qfx' | 'application/vnd.ipfs.ipns-record' | 'application/vnd.ipld.car' | 'application/vnd.ipld.dag-cbor' | 'application/vnd.ipld.dag-json' | 'application/vnd.ipld.raw' | 'application/vnd.iptc.g2.catalogitem+xml' | 'application/vnd.iptc.g2.conceptitem+xml' | 'application/vnd.iptc.g2.knowledgeitem+xml' | 'application/vnd.iptc.g2.newsitem+xml' | 'application/vnd.iptc.g2.newsmessage+xml' | 'application/vnd.iptc.g2.packageitem+xml' | 'application/vnd.iptc.g2.planningitem+xml' | 'application/vnd.ipunplugged.rcprofile' | 'application/vnd.irepository.package+xml' | 'application/vnd.is-xpr' | 'application/vnd.isac.fcs' | 'application/vnd.jam' | 'application/vnd.iso11783-10+zip' | 'application/vnd.japannet-directory-service' | 'application/vnd.japannet-jpnstore-wakeup' | 'application/vnd.japannet-payment-wakeup' | 'application/vnd.japannet-registration' | 'application/vnd.japannet-registration-wakeup' | 'application/vnd.japannet-setstore-wakeup' | 'application/vnd.japannet-verification' | 'application/vnd.japannet-verification-wakeup' | 'application/vnd.jcp.javame.midlet-rms' | 'application/vnd.jisp' | 'application/vnd.joost.joda-archive' | 'application/vnd.jsk.isdn-ngn' | 'application/vnd.kahootz' | 'application/vnd.kde.karbon' | 'application/vnd.kde.kchart' | 'application/vnd.kde.kformula' | 'application/vnd.kde.kivio' | 'application/vnd.kde.kontour' | 'application/vnd.kde.kpresenter' | 'application/vnd.kde.kspread' | 'application/vnd.kde.kword' | 'application/vnd.kenameaapp' | 'application/vnd.kidspiration' | 'application/vnd.Kinar' | 'application/vnd.koan' | 'application/vnd.kodak-descriptor' | 'application/vnd.las' | 'application/vnd.las.las+json' | 'application/vnd.las.las+xml' | 'application/vnd.laszip' | 'application/vnd.ldev.productlicensing' | 'application/vnd.leap+json' | 'application/vnd.liberty-request+xml' | 'application/vnd.llamagraphics.life-balance.desktop' | 'application/vnd.llamagraphics.life-balance.exchange+xml' | 'application/vnd.logipipe.circuit+zip' | 'application/vnd.loom' | 'application/vnd.lotus-1-2-3' | 'application/vnd.lotus-approach' | 'application/vnd.lotus-freelance' | 'application/vnd.lotus-notes' | 'application/vnd.lotus-organizer' | 'application/vnd.lotus-screencam' | 'application/vnd.lotus-wordpro' | 'application/vnd.macports.portpkg' | 'application/vnd.mapbox-vector-tile' | 'application/vnd.marlin.drm.actiontoken+xml' | 'application/vnd.marlin.drm.conftoken+xml' | 'application/vnd.marlin.drm.license+xml' | 'application/vnd.marlin.drm.mdcf' | 'application/vnd.mason+json' | 'application/vnd.maxar.archive.3tz+zip' | 'application/vnd.maxmind.maxmind-db' | 'application/vnd.mcd' | 'application/vnd.mdl' | 'application/vnd.mdl-mbsdf' | 'application/vnd.medcalcdata' | 'application/vnd.mediastation.cdkey' | 'application/vnd.medicalholodeck.recordxr' | 'application/vnd.meridian-slingshot' | 'application/vnd.mermaid' | 'application/vnd.MFER' | 'application/vnd.mfmp' | 'application/vnd.micro+json' | 'application/vnd.micrografx.flo' | 'application/vnd.micrografx.igx' | 'application/vnd.microsoft.portable-executable' | 'application/vnd.microsoft.windows.thumbnail-cache' | 'application/vnd.miele+json' | 'application/vnd.mif' | 'application/vnd.minisoft-hp3000-save' | 'application/vnd.mitsubishi.misty-guard.trustweb' | 'application/vnd.Mobius.DAF' | 'application/vnd.Mobius.DIS' | 'application/vnd.Mobius.MBK' | 'application/vnd.Mobius.MQY' | 'application/vnd.Mobius.MSL' | 'application/vnd.Mobius.PLC' | 'application/vnd.Mobius.TXF' | 'application/vnd.modl' | 'application/vnd.mophun.application' | 'application/vnd.mophun.certificate' | 'application/vnd.motorola.flexsuite' | 'application/vnd.motorola.flexsuite.adsi' | 'application/vnd.motorola.flexsuite.fis' | 'application/vnd.motorola.flexsuite.gotap' | 'application/vnd.motorola.flexsuite.kmr' | 'application/vnd.motorola.flexsuite.ttc' | 'application/vnd.motorola.flexsuite.wem' | 'application/vnd.motorola.iprm' | 'application/vnd.mozilla.xul+xml' | 'application/vnd.ms-artgalry' | 'application/vnd.ms-asf' | 'application/vnd.ms-cab-compressed' | 'application/vnd.ms-3mfdocument' | 'application/vnd.ms-excel' | 'application/vnd.ms-excel.addin.macroEnabled.12' | 'application/vnd.ms-excel.sheet.binary.macroEnabled.12' | 'application/vnd.ms-excel.sheet.macroEnabled.12' | 'application/vnd.ms-excel.template.macroEnabled.12' | 'application/vnd.ms-fontobject' | 'application/vnd.ms-htmlhelp' | 'application/vnd.ms-ims' | 'application/vnd.ms-lrm' | 'application/vnd.ms-office.activeX+xml' | 'application/vnd.ms-officetheme' | 'application/vnd.ms-playready.initiator+xml' | 'application/vnd.ms-powerpoint' | 'application/vnd.ms-powerpoint.addin.macroEnabled.12' | 'application/vnd.ms-powerpoint.presentation.macroEnabled.12' | 'application/vnd.ms-powerpoint.slide.macroEnabled.12' | 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12' | 'application/vnd.ms-powerpoint.template.macroEnabled.12' | 'application/vnd.ms-PrintDeviceCapabilities+xml' | 'application/vnd.ms-PrintSchemaTicket+xml' | 'application/vnd.ms-project' | 'application/vnd.ms-tnef' | 'application/vnd.ms-windows.devicepairing' | 'application/vnd.ms-windows.nwprinting.oob' | 'application/vnd.ms-windows.printerpairing' | 'application/vnd.ms-windows.wsd.oob' | 'application/vnd.ms-wmdrm.lic-chlg-req' | 'application/vnd.ms-wmdrm.lic-resp' | 'application/vnd.ms-wmdrm.meter-chlg-req' | 'application/vnd.ms-wmdrm.meter-resp' | 'application/vnd.ms-word.document.macroEnabled.12' | 'application/vnd.ms-word.template.macroEnabled.12' | 'application/vnd.ms-works' | 'application/vnd.ms-wpl' | 'application/vnd.ms-xpsdocument' | 'application/vnd.msa-disk-image' | 'application/vnd.mseq' | 'application/vnd.msign' | 'application/vnd.multiad.creator' | 'application/vnd.multiad.creator.cif' | 'application/vnd.musician' | 'application/vnd.music-niff' | 'application/vnd.muvee.style' | 'application/vnd.mynfc' | 'application/vnd.nacamar.ybrid+json' | 'application/vnd.nato.bindingdataobject+cbor' | 'application/vnd.nato.bindingdataobject+json' | 'application/vnd.nato.bindingdataobject+xml' | 'application/vnd.nato.openxmlformats-package.iepd+zip' | 'application/vnd.ncd.control' | 'application/vnd.ncd.reference' | 'application/vnd.nearst.inv+json' | 'application/vnd.nebumind.line' | 'application/vnd.nervana' | 'application/vnd.netfpx' | 'application/vnd.neurolanguage.nlu' | 'application/vnd.nimn' | 'application/vnd.nintendo.snes.rom' | 'application/vnd.nintendo.nitro.rom' | 'application/vnd.nitf' | 'application/vnd.noblenet-directory' | 'application/vnd.noblenet-sealer' | 'application/vnd.noblenet-web' | 'application/vnd.nokia.catalogs' | 'application/vnd.nokia.conml+wbxml' | 'application/vnd.nokia.conml+xml' | 'application/vnd.nokia.iptv.config+xml' | 'application/vnd.nokia.iSDS-radio-presets' | 'application/vnd.nokia.landmark+wbxml' | 'application/vnd.nokia.landmark+xml' | 'application/vnd.nokia.landmarkcollection+xml' | 'application/vnd.nokia.ncd' | 'application/vnd.nokia.n-gage.ac+xml' | 'application/vnd.nokia.n-gage.data' | 'application/vnd.nokia.n-gage.symbian.install' | 'application/vnd.nokia.pcd+wbxml' | 'application/vnd.nokia.pcd+xml' | 'application/vnd.nokia.radio-preset' | 'application/vnd.nokia.radio-presets' | 'application/vnd.novadigm.EDM' | 'application/vnd.novadigm.EDX' | 'application/vnd.novadigm.EXT' | 'application/vnd.ntt-local.content-share' | 'application/vnd.ntt-local.file-transfer' | 'application/vnd.ntt-local.ogw_remote-access' | 'application/vnd.ntt-local.sip-ta_remote' | 'application/vnd.ntt-local.sip-ta_tcp_stream' | 'application/vnd.oai.workflows' | 'application/vnd.oai.workflows+json' | 'application/vnd.oai.workflows+yaml' | 'application/vnd.oasis.opendocument.base' | 'application/vnd.oasis.opendocument.chart' | 'application/vnd.oasis.opendocument.chart-template' | 'application/vnd.oasis.opendocument.database' | 'application/vnd.oasis.opendocument.formula' | 'application/vnd.oasis.opendocument.formula-template' | 'application/vnd.oasis.opendocument.graphics' | 'application/vnd.oasis.opendocument.graphics-template' | 'application/vnd.oasis.opendocument.image' | 'application/vnd.oasis.opendocument.image-template' | 'application/vnd.oasis.opendocument.presentation' | 'application/vnd.oasis.opendocument.presentation-template' | 'application/vnd.oasis.opendocument.spreadsheet' | 'application/vnd.oasis.opendocument.spreadsheet-template' | 'application/vnd.oasis.opendocument.text' | 'application/vnd.oasis.opendocument.text-master' | 'application/vnd.oasis.opendocument.text-master-template' | 'application/vnd.oasis.opendocument.text-template' | 'application/vnd.oasis.opendocument.text-web' | 'application/vnd.obn' | 'application/vnd.ocf+cbor' | 'application/vnd.oci.image.manifest.v1+json' | 'application/vnd.oftn.l10n+json' | 'application/vnd.oipf.contentaccessdownload+xml' | 'application/vnd.oipf.contentaccessstreaming+xml' | 'application/vnd.oipf.cspg-hexbinary' | 'application/vnd.oipf.dae.svg+xml' | 'application/vnd.oipf.dae.xhtml+xml' | 'application/vnd.oipf.mippvcontrolmessage+xml' | 'application/vnd.oipf.pae.gem' | 'application/vnd.oipf.spdiscovery+xml' | 'application/vnd.oipf.spdlist+xml' | 'application/vnd.oipf.ueprofile+xml' | 'application/vnd.oipf.userprofile+xml' | 'application/vnd.olpc-sugar' | 'application/vnd.oma.bcast.associated-procedure-parameter+xml' | 'application/vnd.oma.bcast.drm-trigger+xml' | 'application/vnd.oma.bcast.imd+xml' | 'application/vnd.oma.bcast.ltkm' | 'application/vnd.oma.bcast.notification+xml' | 'application/vnd.oma.bcast.provisioningtrigger' | 'application/vnd.oma.bcast.sgboot' | 'application/vnd.oma.bcast.sgdd+xml' | 'application/vnd.oma.bcast.sgdu' | 'application/vnd.oma.bcast.simple-symbol-container' | 'application/vnd.oma.bcast.smartcard-trigger+xml' | 'application/vnd.oma.bcast.sprov+xml' | 'application/vnd.oma.bcast.stkm' | 'application/vnd.oma.cab-address-book+xml' | 'application/vnd.oma.cab-feature-handler+xml' | 'application/vnd.oma.cab-pcc+xml' | 'application/vnd.oma.cab-subs-invite+xml' | 'application/vnd.oma.cab-user-prefs+xml' | 'application/vnd.oma.dcd' | 'application/vnd.oma.dcdc' | 'application/vnd.oma.dd2+xml' | 'application/vnd.oma.drm.risd+xml' | 'application/vnd.oma.group-usage-list+xml' | 'application/vnd.oma.lwm2m+cbor' | 'application/vnd.oma.lwm2m+json' | 'application/vnd.oma.lwm2m+tlv' | 'application/vnd.oma.pal+xml' | 'application/vnd.oma.poc.detailed-progress-report+xml' | 'application/vnd.oma.poc.final-report+xml' | 'application/vnd.oma.poc.groups+xml' | 'application/vnd.oma.poc.invocation-descriptor+xml' | 'application/vnd.oma.poc.optimized-progress-report+xml' | 'application/vnd.oma.push' | 'application/vnd.oma.scidm.messages+xml' | 'application/vnd.oma.xcap-directory+xml' | 'application/vnd.omads-email+xml' | 'application/vnd.omads-file+xml' | 'application/vnd.omads-folder+xml' | 'application/vnd.omaloc-supl-init' | 'application/vnd.oma-scws-config' | 'application/vnd.oma-scws-http-request' | 'application/vnd.oma-scws-http-response' | 'application/vnd.onepager' | 'application/vnd.onepagertamp' | 'application/vnd.onepagertamx' | 'application/vnd.onepagertat' | 'application/vnd.onepagertatp' | 'application/vnd.onepagertatx' | 'application/vnd.onvif.metadata' | 'application/vnd.openblox.game-binary' | 'application/vnd.openblox.game+xml' | 'application/vnd.openeye.oeb' | 'application/vnd.openstreetmap.data+xml' | 'application/vnd.opentimestamps.ots' | 'application/vnd.openxmlformats-officedocument.custom-properties+xml' | 'application/vnd.openxmlformats-officedocument.customXmlProperties+xml' | 'application/vnd.openxmlformats-officedocument.drawing+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml' | 'application/vnd.openxmlformats-officedocument.extended-properties+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.commentAuthors+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.comments+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.handoutMaster+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.presentation' | 'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.presProps+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slide' | 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slideshow' | 'application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slideUpdateInfo+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.tags+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.template' | 'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.template' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml' | 'application/vnd.openxmlformats-officedocument.theme+xml' | 'application/vnd.openxmlformats-officedocument.themeOverride+xml' | 'application/vnd.openxmlformats-officedocument.vmlDrawing' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml' | 'application/vnd.openxmlformats-package.core-properties+xml' | 'application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml' | 'application/vnd.openxmlformats-package.relationships+xml' | 'application/vnd.oracle.resource+json' | 'application/vnd.orange.indata' | 'application/vnd.osa.netdeploy' | 'application/vnd.osgeo.mapguide.package' | 'application/vnd.osgi.bundle' | 'application/vnd.osgi.dp' | 'application/vnd.osgi.subsystem' | 'application/vnd.otps.ct-kip+xml' | 'application/vnd.oxli.countgraph' | 'application/vnd.pagerduty+json' | 'application/vnd.palm' | 'application/vnd.panoply' | 'application/vnd.paos.xml' | 'application/vnd.patentdive' | 'application/vnd.patientecommsdoc' | 'application/vnd.pawaafile' | 'application/vnd.pcos' | 'application/vnd.pg.format' | 'application/vnd.pg.osasli' | 'application/vnd.piaccess.application-licence' | 'application/vnd.picsel' | 'application/vnd.pmi.widget' | 'application/vnd.poc.group-advertisement+xml' | 'application/vnd.pocketlearn' | 'application/vnd.powerbuilder6' | 'application/vnd.powerbuilder6-s' | 'application/vnd.powerbuilder7' | 'application/vnd.powerbuilder75' | 'application/vnd.powerbuilder75-s' | 'application/vnd.powerbuilder7-s' | 'application/vnd.preminet' | 'application/vnd.previewsystems.box' | 'application/vnd.proteus.magazine' | 'application/vnd.psfs' | 'application/vnd.pt.mundusmundi' | 'application/vnd.publishare-delta-tree' | 'application/vnd.pvi.ptid1' | 'application/vnd.pwg-multiplexed' | 'application/vnd.pwg-xhtml-print+xml' | 'application/vnd.qualcomm.brew-app-res' | 'application/vnd.quarantainenet' | 'application/vnd.Quark.QuarkXPress' | 'application/vnd.quobject-quoxdocument' | 'application/vnd.radisys.moml+xml' | 'application/vnd.radisys.msml-audit-conf+xml' | 'application/vnd.radisys.msml-audit-conn+xml' | 'application/vnd.radisys.msml-audit-dialog+xml' | 'application/vnd.radisys.msml-audit-stream+xml' | 'application/vnd.radisys.msml-audit+xml' | 'application/vnd.radisys.msml-conf+xml' | 'application/vnd.radisys.msml-dialog-base+xml' | 'application/vnd.radisys.msml-dialog-fax-detect+xml' | 'application/vnd.radisys.msml-dialog-fax-sendrecv+xml' | 'application/vnd.radisys.msml-dialog-group+xml' | 'application/vnd.radisys.msml-dialog-speech+xml' | 'application/vnd.radisys.msml-dialog-transform+xml' | 'application/vnd.radisys.msml-dialog+xml' | 'application/vnd.radisys.msml+xml' | 'application/vnd.rainstor.data' | 'application/vnd.rapid' | 'application/vnd.rar' | 'application/vnd.realvnc.bed' | 'application/vnd.recordare.musicxml' | 'application/vnd.recordare.musicxml+xml' | 'application/vnd.relpipe' | 'application/vnd.RenLearn.rlprint' | 'application/vnd.resilient.logic' | 'application/vnd.restful+json' | 'application/vnd.rig.cryptonote' | 'application/vnd.route66.link66+xml' | 'application/vnd.rs-274x' | 'application/vnd.ruckus.download' | 'application/vnd.s3sms' | 'application/vnd.sailingtracker.track' | 'application/vnd.sar' | 'application/vnd.sbm.cid' | 'application/vnd.sbm.mid2' | 'application/vnd.scribus' | 'application/vnd.sealed.3df' | 'application/vnd.sealed.csf' | 'application/vnd.sealed.doc' | 'application/vnd.sealed.eml' | 'application/vnd.sealed.mht' | 'application/vnd.sealed.net' | 'application/vnd.sealed.ppt' | 'application/vnd.sealed.tiff' | 'application/vnd.sealed.xls' | 'application/vnd.sealedmedia.softseal.html' | 'application/vnd.sealedmedia.softseal.pdf' | 'application/vnd.seemail' | 'application/vnd.seis+json' | 'application/vnd.sema' | 'application/vnd.semd' | 'application/vnd.semf' | 'application/vnd.shade-save-file' | 'application/vnd.shana.informed.formdata' | 'application/vnd.shana.informed.formtemplate' | 'application/vnd.shana.informed.interchange' | 'application/vnd.shana.informed.package' | 'application/vnd.shootproof+json' | 'application/vnd.shopkick+json' | 'application/vnd.shp' | 'application/vnd.shx' | 'application/vnd.sigrok.session' | 'application/vnd.SimTech-MindMapper' | 'application/vnd.siren+json' | 'application/vnd.smaf' | 'application/vnd.smart.notebook' | 'application/vnd.smart.teacher' | 'application/vnd.smintio.portals.archive' | 'application/vnd.snesdev-page-table' | 'application/vnd.software602.filler.form+xml' | 'application/vnd.software602.filler.form-xml-zip' | 'application/vnd.solent.sdkm+xml' | 'application/vnd.spotfire.dxp' | 'application/vnd.spotfire.sfs' | 'application/vnd.sqlite3' | 'application/vnd.sss-cod' | 'application/vnd.sss-dtf' | 'application/vnd.sss-ntf' | 'application/vnd.stepmania.package' | 'application/vnd.stepmania.stepchart' | 'application/vnd.street-stream' | 'application/vnd.sun.wadl+xml' | 'application/vnd.sus-calendar' | 'application/vnd.svd' | 'application/vnd.swiftview-ics' | 'application/vnd.sybyl.mol2' | 'application/vnd.sycle+xml' | 'application/vnd.syft+json' | 'application/vnd.syncml.dm.notification' | 'application/vnd.syncml.dmddf+xml' | 'application/vnd.syncml.dmtnds+wbxml' | 'application/vnd.syncml.dmtnds+xml' | 'application/vnd.syncml.dmddf+wbxml' | 'application/vnd.syncml.dm+wbxml' | 'application/vnd.syncml.dm+xml' | 'application/vnd.syncml.ds.notification' | 'application/vnd.syncml+xml' | 'application/vnd.tableschema+json' | 'application/vnd.tao.intent-module-archive' | 'application/vnd.tcpdump.pcap' | 'application/vnd.think-cell.ppttc+json' | 'application/vnd.tml' | 'application/vnd.tmd.mediaflex.api+xml' | 'application/vnd.tmobile-livetv' | 'application/vnd.tri.onesource' | 'application/vnd.trid.tpt' | 'application/vnd.triscape.mxs' | 'application/vnd.trueapp' | 'application/vnd.truedoc' | 'application/vnd.ubisoft.webplayer' | 'application/vnd.ufdl' | 'application/vnd.uiq.theme' | 'application/vnd.umajin' | 'application/vnd.unity' | 'application/vnd.uoml+xml' | 'application/vnd.uplanet.alert' | 'application/vnd.uplanet.alert-wbxml' | 'application/vnd.uplanet.bearer-choice' | 'application/vnd.uplanet.bearer-choice-wbxml' | 'application/vnd.uplanet.cacheop' | 'application/vnd.uplanet.cacheop-wbxml' | 'application/vnd.uplanet.channel' | 'application/vnd.uplanet.channel-wbxml' | 'application/vnd.uplanet.list' | 'application/vnd.uplanet.listcmd' | 'application/vnd.uplanet.listcmd-wbxml' | 'application/vnd.uplanet.list-wbxml' | 'application/vnd.uri-map' | 'application/vnd.uplanet.signal' | 'application/vnd.valve.source.material' | 'application/vnd.vcx' | 'application/vnd.vd-study' | 'application/vnd.vectorworks' | 'application/vnd.vel+json' | 'application/vnd.verimatrix.vcas' | 'application/vnd.veritone.aion+json' | 'application/vnd.veryant.thin' | 'application/vnd.ves.encrypted' | 'application/vnd.vidsoft.vidconference' | 'application/vnd.visio' | 'application/vnd.visionary' | 'application/vnd.vividence.scriptfile' | 'application/vnd.vsf' | 'application/vnd.wap.sic' | 'application/vnd.wap.slc' | 'application/vnd.wap.wbxml' | 'application/vnd.wap.wmlc' | 'application/vnd.wap.wmlscriptc' | 'application/vnd.wasmflow.wafl' | 'application/vnd.webturbo' | 'application/vnd.wfa.dpp' | 'application/vnd.wfa.p2p' | 'application/vnd.wfa.wsc' | 'application/vnd.windows.devicepairing' | 'application/vnd.wmc' | 'application/vnd.wmf.bootstrap' | 'application/vnd.wolfram.mathematica' | 'application/vnd.wolfram.mathematica.package' | 'application/vnd.wolfram.player' | 'application/vnd.wordlift' | 'application/vnd.wordperfect' | 'application/vnd.wqd' | 'application/vnd.wrq-hp3000-labelled' | 'application/vnd.wt.stf' | 'application/vnd.wv.csp+xml' | 'application/vnd.wv.csp+wbxml' | 'application/vnd.wv.ssp+xml' | 'application/vnd.xacml+json' | 'application/vnd.xara' | 'application/vnd.xecrets-encrypted' | 'application/vnd.xfdl' | 'application/vnd.xfdl.webform' | 'application/vnd.xmi+xml' | 'application/vnd.xmpie.cpkg' | 'application/vnd.xmpie.dpkg' | 'application/vnd.xmpie.plan' | 'application/vnd.xmpie.ppkg' | 'application/vnd.xmpie.xlim' | 'application/vnd.yamaha.hv-dic' | 'application/vnd.yamaha.hv-script' | 'application/vnd.yamaha.hv-voice' | 'application/vnd.yamaha.openscoreformat.osfpvg+xml' | 'application/vnd.yamaha.openscoreformat' | 'application/vnd.yamaha.remote-setup' | 'application/vnd.yamaha.smaf-audio' | 'application/vnd.yamaha.smaf-phrase' | 'application/vnd.yamaha.through-ngn' | 'application/vnd.yamaha.tunnel-udpencap' | 'application/vnd.yaoweme' | 'application/vnd.yellowriver-custom-menu' | 'application/vnd.youtube.yt' | 'application/vnd.zul' | 'application/vnd.zzazz.deck+xml' | 'application/voicexml+xml' | 'application/voucher-cms+json' | 'application/vq-rtcpxr' | 'application/wasm' | 'application/watcherinfo+xml' | 'application/webpush-options+json' | 'application/whoispp-query' | 'application/whoispp-response' | 'application/widget' | 'application/wita' | 'application/wordperfect5.1' | 'application/wsdl+xml' | 'application/wspolicy+xml' | 'application/x-pki-message' | 'application/x-www-form-urlencoded' | 'application/x-x509-ca-cert' | 'application/x-x509-ca-ra-cert' | 'application/x-x509-next-ca-cert' | 'application/x400-bp' | 'application/xacml+xml' | 'application/xcap-att+xml' | 'application/xcap-caps+xml' | 'application/xcap-diff+xml' | 'application/xcap-el+xml' | 'application/xcap-error+xml' | 'application/xcap-ns+xml' | 'application/xcon-conference-info-diff+xml' | 'application/xcon-conference-info+xml' | 'application/xenc+xml' | 'application/xfdf' | 'application/xhtml+xml' | 'application/xliff+xml' | 'application/xml' | 'application/xml-dtd' | 'application/xml-external-parsed-entity' | 'application/xml-patch+xml' | 'application/xmpp+xml' | 'application/xop+xml' | 'application/xslt+xml' | 'application/xv+xml' | 'application/yaml' | 'application/yang' | 'application/yang-data+cbor' | 'application/yang-data+json' | 'application/yang-data+xml' | 'application/yang-patch+json' | 'application/yang-patch+xml' | 'application/yin+xml' | 'application/zip' | 'application/zlib' | 'application/zstd' | 'audio/1d-interleaved-parityfec' | 'audio/32kadpcm' | 'audio/3gpp' | 'audio/3gpp2' | 'audio/aac' | 'audio/ac3' | 'audio/AMR' | 'audio/AMR-WB' | 'audio/amr-wb+' | 'audio/aptx' | 'audio/asc' | 'audio/ATRAC-ADVANCED-LOSSLESS' | 'audio/ATRAC-X' | 'audio/ATRAC3' | 'audio/basic' | 'audio/BV16' | 'audio/BV32' | 'audio/clearmode' | 'audio/CN' | 'audio/DAT12' | 'audio/dls' | 'audio/dsr-es201108' | 'audio/dsr-es202050' | 'audio/dsr-es202211' | 'audio/dsr-es202212' | 'audio/DV' | 'audio/DVI4' | 'audio/eac3' | 'audio/encaprtp' | 'audio/EVRC' | 'audio/EVRC-QCP' | 'audio/EVRC0' | 'audio/EVRC1' | 'audio/EVRCB' | 'audio/EVRCB0' | 'audio/EVRCB1' | 'audio/EVRCNW' | 'audio/EVRCNW0' | 'audio/EVRCNW1' | 'audio/EVRCWB' | 'audio/EVRCWB0' | 'audio/EVRCWB1' | 'audio/EVS' | 'audio/example' | 'audio/flexfec' | 'audio/fwdred' | 'audio/G711-0' | 'audio/G719' | 'audio/G7221' | 'audio/G722' | 'audio/G723' | 'audio/G726-16' | 'audio/G726-24' | 'audio/G726-32' | 'audio/G726-40' | 'audio/G728' | 'audio/G729' | 'audio/G7291' | 'audio/G729D' | 'audio/G729E' | 'audio/GSM' | 'audio/GSM-EFR' | 'audio/GSM-HR-08' | 'audio/iLBC' | 'audio/ip-mr_v2.5' | 'audio/L8' | 'audio/L16' | 'audio/L20' | 'audio/L24' | 'audio/LPC' | 'audio/matroska' | 'audio/MELP' | 'audio/MELP600' | 'audio/MELP1200' | 'audio/MELP2400' | 'audio/mhas' | 'audio/mobile-xmf' | 'audio/MPA' | 'audio/mp4' | 'audio/MP4A-LATM' | 'audio/mpa-robust' | 'audio/mpeg' | 'audio/mpeg4-generic' | 'audio/ogg' | 'audio/opus' | 'audio/parityfec' | 'audio/PCMA' | 'audio/PCMA-WB' | 'audio/PCMU' | 'audio/PCMU-WB' | 'audio/prs.sid' | 'audio/QCELP' | 'audio/raptorfec' | 'audio/RED' | 'audio/rtp-enc-aescm128' | 'audio/rtploopback' | 'audio/rtp-midi' | 'audio/rtx' | 'audio/scip' | 'audio/SMV' | 'audio/SMV0' | 'audio/SMV-QCP' | 'audio/sofa' | 'audio/sp-midi' | 'audio/speex' | 'audio/t140c' | 'audio/t38' | 'audio/telephone-event' | 'audio/TETRA_ACELP' | 'audio/TETRA_ACELP_BB' | 'audio/tone' | 'audio/TSVCIS' | 'audio/UEMCLIP' | 'audio/ulpfec' | 'audio/usac' | 'audio/VDVI' | 'audio/VMR-WB' | 'audio/vnd.3gpp.iufp' | 'audio/vnd.4SB' | 'audio/vnd.audiokoz' | 'audio/vnd.CELP' | 'audio/vnd.cisco.nse' | 'audio/vnd.cmles.radio-events' | 'audio/vnd.cns.anp1' | 'audio/vnd.cns.inf1' | 'audio/vnd.dece.audio' | 'audio/vnd.digital-winds' | 'audio/vnd.dlna.adts' | 'audio/vnd.dolby.heaac.1' | 'audio/vnd.dolby.heaac.2' | 'audio/vnd.dolby.mlp' | 'audio/vnd.dolby.mps' | 'audio/vnd.dolby.pl2' | 'audio/vnd.dolby.pl2x' | 'audio/vnd.dolby.pl2z' | 'audio/vnd.dolby.pulse.1' | 'audio/vnd.dra' | 'audio/vnd.dts' | 'audio/vnd.dts.hd' | 'audio/vnd.dts.uhd' | 'audio/vnd.dvb.file' | 'audio/vnd.everad.plj' | 'audio/vnd.hns.audio' | 'audio/vnd.lucent.voice' | 'audio/vnd.ms-playready.media.pya' | 'audio/vnd.nokia.mobile-xmf' | 'audio/vnd.nortel.vbk' | 'audio/vnd.nuera.ecelp4800' | 'audio/vnd.nuera.ecelp7470' | 'audio/vnd.nuera.ecelp9600' | 'audio/vnd.octel.sbc' | 'audio/vnd.presonus.multitrack' | 'audio/vnd.qcelp' | 'audio/vnd.rhetorex.32kadpcm' | 'audio/vnd.rip' | 'audio/vnd.sealedmedia.softseal.mpeg' | 'audio/vnd.vmx.cvsd' | 'audio/vorbis' | 'audio/vorbis-config' | 'font/collection' | 'font/otf' | 'font/sfnt' | 'font/ttf' | 'font/woff' | 'font/woff2' | 'image/aces' | 'image/apng' | 'image/avci' | 'image/avcs' | 'image/avif' | 'image/bmp' | 'image/cgm' | 'image/dicom-rle' | 'image/dpx' | 'image/emf' | 'image/example' | 'image/fits' | 'image/g3fax' | 'image/heic' | 'image/heic-sequence' | 'image/heif' | 'image/heif-sequence' | 'image/hej2k' | 'image/hsj2' | 'image/j2c' | 'image/jls' | 'image/jp2' | 'image/jph' | 'image/jphc' | 'image/jpm' | 'image/jpx' | 'image/jxr' | 'image/jxrA' | 'image/jxrS' | 'image/jxs' | 'image/jxsc' | 'image/jxsi' | 'image/jxss' | 'image/ktx' | 'image/ktx2' | 'image/naplps' | 'image/png' | 'image/prs.btif' | 'image/prs.pti' | 'image/pwg-raster' | 'image/svg+xml' | 'image/t38' | 'image/tiff' | 'image/tiff-fx' | 'image/vnd.adobe.photoshop' | 'image/vnd.airzip.accelerator.azv' | 'image/vnd.cns.inf2' | 'image/vnd.dece.graphic' | 'image/vnd.djvu' | 'image/vnd.dwg' | 'image/vnd.dxf' | 'image/vnd.dvb.subtitle' | 'image/vnd.fastbidsheet' | 'image/vnd.fpx' | 'image/vnd.fst' | 'image/vnd.fujixerox.edmics-mmr' | 'image/vnd.fujixerox.edmics-rlc' | 'image/vnd.globalgraphics.pgb' | 'image/vnd.microsoft.icon' | 'image/vnd.mix' | 'image/vnd.ms-modi' | 'image/vnd.mozilla.apng' | 'image/vnd.net-fpx' | 'image/vnd.pco.b16' | 'image/vnd.radiance' | 'image/vnd.sealed.png' | 'image/vnd.sealedmedia.softseal.gif' | 'image/vnd.sealedmedia.softseal.jpg' | 'image/vnd.svf' | 'image/vnd.tencent.tap' | 'image/vnd.valve.source.texture' | 'image/vnd.wap.wbmp' | 'image/vnd.xiff' | 'image/vnd.zbrush.pcx' | 'image/webp' | 'image/wmf' | 'image/emf' | 'image/wmf' | 'message/bhttp' | 'message/CPIM' | 'message/delivery-status' | 'message/disposition-notification' | 'message/example' | 'message/feedback-report' | 'message/global' | 'message/global-delivery-status' | 'message/global-disposition-notification' | 'message/global-headers' | 'message/http' | 'message/imdn+xml' | 'message/mls' | 'message/news' | 'message/ohttp-req' | 'message/ohttp-res' | 'message/s-http' | 'message/sip' | 'message/sipfrag' | 'message/tracking-status' | 'message/vnd.si.simp' | 'message/vnd.wfa.wsc' | 'model/3mf' | 'model/e57' | 'model/example' | 'model/gltf-binary' | 'model/gltf+json' | 'model/JT' | 'model/iges' | 'model/mtl' | 'model/obj' | 'model/prc' | 'model/step' | 'model/step+xml' | 'model/step+zip' | 'model/step-xml+zip' | 'model/stl' | 'model/u3d' | 'model/vnd.bary' | 'model/vnd.cld' | 'model/vnd.collada+xml' | 'model/vnd.dwf' | 'model/vnd.flatland.3dml' | 'model/vnd.gdl' | 'model/vnd.gs-gdl' | 'model/vnd.gtw' | 'model/vnd.moml+xml' | 'model/vnd.mts' | 'model/vnd.opengex' | 'model/vnd.parasolid.transmit.binary' | 'model/vnd.parasolid.transmit.text' | 'model/vnd.pytha.pyox' | 'model/vnd.rosette.annotated-data-model' | 'model/vnd.sap.vds' | 'model/vnd.usda' | 'model/vnd.usdz+zip' | 'model/vnd.valve.source.compiled-map' | 'model/vnd.vtu' | 'model/x3d-vrml' | 'model/x3d+fastinfoset' | 'model/x3d+xml' | 'multipart/appledouble' | 'multipart/byteranges' | 'multipart/encrypted' | 'multipart/example' | 'multipart/form-data' | 'multipart/header-set' | 'multipart/multilingual' | 'multipart/related' | 'multipart/report' | 'multipart/signed' | 'multipart/vnd.bint.med-plus' | 'multipart/voice-message' | 'multipart/x-mixed-replace' | 'text/1d-interleaved-parityfec' | 'text/cache-manifest' | 'text/calendar' | 'text/cql' | 'text/cql-expression' | 'text/cql-identifier' | 'text/css' | 'text/csv' | 'text/csv-schema' | 'text/directory' | 'text/dns' | 'text/ecmascript' | 'text/encaprtp' | 'text/example' | 'text/fhirpath' | 'text/flexfec' | 'text/fwdred' | 'text/gff3' | 'text/grammar-ref-list' | 'text/hl7v2' | 'text/html' | 'text/javascript' | 'text/jcr-cnd' | 'text/markdown' | 'text/mizar' | 'text/n3' | 'text/parameters' | 'text/parityfec' | 'text/provenance-notation' | 'text/prs.fallenstein.rst' | 'text/prs.lines.tag' | 'text/prs.prop.logic' | 'text/prs.texi' | 'text/raptorfec' | 'text/RED' | 'text/rfc822-headers' | 'text/rtf' | 'text/rtp-enc-aescm128' | 'text/rtploopback' | 'text/rtx' | 'text/SGML' | 'text/shaclc' | 'text/shex' | 'text/spdx' | 'text/strings' | 'text/t140' | 'text/tab-separated-values' | 'text/troff' | 'text/turtle' | 'text/ulpfec' | 'text/uri-list' | 'text/vcard' | 'text/vnd.a' | 'text/vnd.abc' | 'text/vnd.ascii-art' | 'text/vnd.curl' | 'text/vnd.debian.copyright' | 'text/vnd.DMClientScript' | 'text/vnd.dvb.subtitle' | 'text/vnd.esmertec.theme-descriptor' | 'text/vnd.exchangeable' | 'text/vnd.familysearch.gedcom' | 'text/vnd.ficlab.flt' | 'text/vnd.fly' | 'text/vnd.fmi.flexstor' | 'text/vnd.gml' | 'text/vnd.graphviz' | 'text/vnd.hans' | 'text/vnd.hgl' | 'text/vnd.in3d.3dml' | 'text/vnd.in3d.spot' | 'text/vnd.IPTC.NewsML' | 'text/vnd.IPTC.NITF' | 'text/vnd.latex-z' | 'text/vnd.motorola.reflex' | 'text/vnd.ms-mediapackage' | 'text/vnd.net2phone.commcenter.command' | 'text/vnd.radisys.msml-basic-layout' | 'text/vnd.senx.warpscript' | 'text/vnd.si.uricatalogue' | 'text/vnd.sun.j2me.app-descriptor' | 'text/vnd.sosi' | 'text/vnd.trolltech.linguist' | 'text/vnd.wap.si' | 'text/vnd.wap.sl' | 'text/vnd.wap.wml' | 'text/vnd.wap.wmlscript' | 'text/vtt' | 'text/wgsl' | 'text/xml' | 'text/xml-external-parsed-entity' | 'video/1d-interleaved-parityfec' | 'video/3gpp' | 'video/3gpp2' | 'video/3gpp-tt' | 'video/AV1' | 'video/BMPEG' | 'video/BT656' | 'video/CelB' | 'video/DV' | 'video/encaprtp' | 'video/example' | 'video/FFV1' | 'video/flexfec' | 'video/H261' | 'video/H263' | 'video/H263-1998' | 'video/H263-2000' | 'video/H264' | 'video/H264-RCDO' | 'video/H264-SVC' | 'video/H265' | 'video/H266' | 'video/iso.segment' | 'video/JPEG' | 'video/jpeg2000' | 'video/jxsv' | 'video/matroska' | 'video/matroska-3d' | 'video/mj2' | 'video/MP1S' | 'video/MP2P' | 'video/MP2T' | 'video/mp4' | 'video/MP4V-ES' | 'video/MPV' | 'video/mpeg4-generic' | 'video/nv' | 'video/ogg' | 'video/parityfec' | 'video/pointer' | 'video/quicktime' | 'video/raptorfec' | 'video/raw' | 'video/rtp-enc-aescm128' | 'video/rtploopback' | 'video/rtx' | 'video/scip' | 'video/smpte291' | 'video/SMPTE292M' | 'video/ulpfec' | 'video/vc1' | 'video/vc2' | 'video/vnd.CCTV' | 'video/vnd.dece.hd' | 'video/vnd.dece.mobile' | 'video/vnd.dece.mp4' | 'video/vnd.dece.pd' | 'video/vnd.dece.sd' | 'video/vnd.dece.video' | 'video/vnd.directv.mpeg' | 'video/vnd.directv.mpeg-tts' | 'video/vnd.dlna.mpeg-tts' | 'video/vnd.dvb.file' | 'video/vnd.fvt' | 'video/vnd.hns.video' | 'video/vnd.iptvforum.1dparityfec-1010' | 'video/vnd.iptvforum.1dparityfec-2005' | 'video/vnd.iptvforum.2dparityfec-1010' | 'video/vnd.iptvforum.2dparityfec-2005' | 'video/vnd.iptvforum.ttsavc' | 'video/vnd.iptvforum.ttsmpeg2' | 'video/vnd.motorola.video' | 'video/vnd.motorola.videop' | 'video/vnd.mpegurl' | 'video/vnd.ms-playready.media.pyv' | 'video/vnd.nokia.interleaved-multimedia' | 'video/vnd.nokia.mp4vr' | 'video/vnd.nokia.videovoip' | 'video/vnd.objectvideo' | 'video/vnd.radgamettools.bink' | 'video/vnd.radgamettools.smacker' | 'video/vnd.sealed.mpeg1' | 'video/vnd.sealed.mpeg4' | 'video/vnd.sealed.swf' | 'video/vnd.sealedmedia.softseal.mov' | 'video/vnd.uvvu.mp4' | 'video/vnd.youtube.yt' | 'video/vnd.vivo' | 'video/VP8' | 'video/VP9' | AnyString;

type RequestHeaders = Partial<Record<HTTPHeaderName, string | undefined>>;
type _HTTPHeaderName = "WWW-Authenticate" | "Authorization" | "Proxy-Authenticate" | "Proxy-Authorization" | "Age" | "Cache-Control" | "Clear-Site-Data" | "Expires" | "Pragma" | "Accept-CH" | "Critical-CH" | "Sec-CH-UA" | "Sec-CH-UA-Arch" | "Sec-CH-UA-Bitness" | "Sec-CH-UA-Full-Version-List" | "Sec-CH-UA-Mobile" | "Sec-CH-UA-Model" | "Sec-CH-UA-Platform" | "Sec-CH-UA-Platform-Version" | "Sec-CH-UA-Prefers-Color-Scheme" | "Sec-CH-UA-Prefers-Reduced-Motion" | "Downlink" | "ECT" | "RTT" | "Save-Data" | "Last-Modified" | "ETag" | "If-Match" | "If-None-Match" | "If-Modified-Since" | "If-Unmodified-Since" | "Vary" | "Connection" | "Keep-Alive" | "Accept" | "Accept-Encoding" | "Accept-Language" | "Expect" | "Max-Forwards" | "Cookie" | "Set-Cookie" | "Access-Control-Allow-Origin" | "Access-Control-Allow-Credentials" | "Access-Control-Allow-Headers" | "Access-Control-Allow-Methods" | "Access-Control-Expose-Headers" | "Access-Control-Max-Age" | "Access-Control-Request-Headers" | "Access-Control-Request-Method" | "Origin" | "Timing-Allow-Origin" | "Content-Disposition" | "Content-Length" | "Content-Type" | "Content-Encoding" | "Content-Language" | "Content-Location" | "Forwarded" | "X-Forwarded-For" | "X-Forwarded-Host" | "X-Forwarded-Proto" | "Via" | "Location" | "Refresh" | "From" | "Host" | "Referer" | "Referrer-Policy" | "User-Agent" | "Allow" | "Server" | "Accept-Ranges" | "Range" | "If-Range" | "Content-Range" | "Cross-Origin-Embedder-Policy" | "Cross-Origin-Opener-Policy" | "Cross-Origin-Resource-Policy" | "Content-Security-Policy" | "Content-Security-Policy-Report-Only" | "Expect-CT" | "Origin-Isolation" | "Permissions-Policy" | "Strict-Transport-Security" | "Upgrade-Insecure-Requests" | "X-Content-Type-Options" | "X-Frame-Options" | "X-Permitted-Cross-Domain-Policies" | "X-Powered-By" | "X-XSS-Protection" | "Sec-Fetch-Site" | "Sec-Fetch-Mode" | "Sec-Fetch-User" | "Sec-Fetch-Dest" | "Sec-Purpose" | "Service-Worker-Navigation-Preload" | "Last-Event-ID" | "NEL" | "Ping-From" | "Ping-To" | "Report-To" | "Transfer-Encoding" | "TE" | "Trailer" | "Sec-WebSocket-Key" | "Sec-WebSocket-Extensions" | "Sec-WebSocket-Accept" | "Sec-WebSocket-Protocol" | "Sec-WebSocket-Version" | "Accept-Push-Policy" | "Accept-Signature" | "Alt-Svc" | "Alt-Used" | "Date" | "Early-Data" | "Link" | "Push-Policy" | "Retry-After" | "Signature" | "Signed-Headers" | "Server-Timing" | "Service-Worker-Allowed" | "SourceMap" | "Upgrade" | "X-DNS-Prefetch-Control" | "X-Pingback" | "X-Requested-With" | "X-Robots-Tag";
type HTTPHeaderName = _HTTPHeaderName | Lowercase<_HTTPHeaderName> | (string & {});
type ClientHint = "Sec-CH-UA" | "Sec-CH-UA-Arch" | "Sec-CH-UA-Bitness" | "Sec-CH-UA-Full-Version-List" | "Sec-CH-UA-Full-Version" | "Sec-CH-UA-Mobile" | "Sec-CH-UA-Model" | "Sec-CH-UA-Platform" | "Sec-CH-UA-Platform-Version" | "Sec-CH-Prefers-Reduced-Motion" | "Sec-CH-Prefers-Color-Scheme" | "Device-Memory" | "Width" | "Viewport-Width" | "Save-Data" | "Downlink" | "ECT" | "RTT" | AnyString;
type TypedHeaders = Partial<Record<HTTPHeaderName, unknown>> & Partial<{
    host: string;
    location: string;
    referrer: string;
    origin: "null" | AnyString;
    from: string;
    "alt-used": string;
    "content-location": string;
    sourcemap: string;
    "content-length": number;
    "access-control-max-age": number;
    "retry-after": number;
    rtt: number;
    age: number;
    "max-forwards": number;
    downlink: number;
    "device-memory": 0.25 | 0.5 | 1 | 2 | 4 | 8 | AnyNumber;
    accept: MimeType | MimeType[] | `${MimeType};q=${number}`[];
    "content-type": MimeType;
    "accept-ch": ClientHint | ClientHint[];
    "keep-alive": `timeout=${number}, max=${number}` | AnyString;
    "access-control-allow-credentials": "true" | AnyString;
    "access-control-allow-headers": "*" | HTTPHeaderName[] | AnyString;
    "access-control-allow-methods": "*" | HTTPMethod[] | AnyString;
    "access-control-allow-origin": "*" | "null" | AnyString;
    "access-control-expose-headers": "*" | HTTPHeaderName[] | AnyString;
    "access-control-request-headers": HTTPHeaderName[] | AnyString;
    "access-control-request-method": HTTPMethod | AnyString;
    "early-data": 1;
    "upgrade-insecure-requests": 1;
    "accept-ranges": "bytes" | "none" | AnyString;
    connection: "keep-alive" | "close" | "upgrade" | AnyString;
    ect: "slow-2g" | "2g" | "3g" | "4g" | AnyString;
    expect: "100-continue" | AnyString;
    "save-data": `on` | `off` | AnyString;
    "sec-ch-prefers-reduced-motion": "no-preference" | "reduce" | AnyString;
    "sec-ch-prefers-reduced-transparency": "no-preference" | "reduce" | AnyString;
    "sec-ch-ua-mobile": `?1` | `?0` | AnyString;
    "origin-agent-cluster": `?1` | `?0` | AnyString;
    "sec-fetch-user": "?1" | AnyString;
    "sec-purpose": "prefetch" | AnyString;
    "x-content-type-options": "nosniff" | AnyString;
    "x-dns-prefetch-control": "on" | "off" | AnyString;
    "x-frame-options": "DENY" | "SAMEORIGIN" | AnyString;
    "sec-ch-ua-arch": "x86" | "ARM" | "[arm64-v8a, armeabi-v7a, armeabi]" | AnyString;
    "sec-fetch-site": "cross-site" | "same-origin" | "same-site" | "none" | AnyString;
    "sec-ch-prefers-color-scheme": "dark" | "light" | AnyString;
    "sec-ch-ua-bitness": "64" | "32" | AnyString;
    "sec-fetch-mode": "cors" | "navigate" | "no-cors" | "same-origin" | "websocket" | AnyString;
    "cross-origin-embedder-policy": "unsafe-none" | "require-corp" | "credentialless" | AnyString;
    "cross-origin-opener-policy": "unsafe-none" | "same-origin-allow-popups" | "same-origin" | AnyString;
    "cross-origin-resource-policy": "same-site" | "same-origin" | "cross-origin" | AnyString;
    "sec-ch-ua-platform": "Android" | "Chrome  OS" | "Chromium  OS" | "iOS" | "Linux" | "macOS" | "Windows" | "Unknown" | AnyString;
    "referrer-policy": "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url" | AnyString;
    "sec-fetch-dest": "audio" | "audioworklet" | "document" | "embed" | "empty" | "font" | "frame" | "iframe" | "image" | "manifest" | "object" | "paintworklet" | "report" | "script" | "serviceworker" | "sharedworker" | "style" | "track" | "video" | "worker" | "xslt" | AnyString;
}>;

type HTTPMethod = "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE";
type Encoding = false | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";
type StatusCode = 100 | 101 | 102 | 103 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 444 | 450 | 451 | 497 | 498 | 499 | 500 | 501 | 502 | 503 | 504 | 506 | 507 | 508 | 509 | 510 | 511 | 521 | 522 | 523 | 525 | 530 | 599 | AnyNumber;
interface H3EventContext extends Record<string, any> {
    params?: Record<string, string>;
    /**
     * Matched router Node
     *
     * @experimental The object structure may change in non-major version.
     */
    matchedRoute?: RouteNode;
    sessions?: Record<string, Session>;
    clientAddress?: string;
}
type EventHandlerResponse<T = any> = T | Promise<T>;
interface EventHandlerRequest {
    body?: any;
    query?: QueryObject;
    routerParams?: Record<string, string>;
}
type InferEventInput<Key extends keyof EventHandlerRequest, Event extends H3Event, T> = void extends T ? (Event extends H3Event<infer E> ? E[Key] : never) : T;
type MaybePromise<T> = T | Promise<T>;
type EventHandlerResolver = (path: string) => MaybePromise<undefined | {
    route?: string;
    handler: EventHandler;
}>;
interface EventHandler<Request extends EventHandlerRequest = EventHandlerRequest, Response extends EventHandlerResponse = EventHandlerResponse> {
    __is_handler__?: true;
    __resolve__?: EventHandlerResolver;
    __websocket__?: Partial<Hooks>;
    (event: H3Event<Request>): Response;
}
type _RequestMiddleware<Request extends EventHandlerRequest = EventHandlerRequest> = (event: H3Event<Request>) => void | Promise<void>;
type _ResponseMiddleware<Request extends EventHandlerRequest = EventHandlerRequest, Response extends EventHandlerResponse = EventHandlerResponse> = (event: H3Event<Request>, response: {
    body?: Awaited<Response>;
}) => void | Promise<void>;
type EventHandlerObject<Request extends EventHandlerRequest = EventHandlerRequest, Response extends EventHandlerResponse = EventHandlerResponse> = {
    onRequest?: _RequestMiddleware<Request> | _RequestMiddleware<Request>[];
    onBeforeResponse?: _ResponseMiddleware<Request, Response> | _ResponseMiddleware<Request, Response>[];
    /** @experimental */
    websocket?: Partial<Hooks>;
    handler: EventHandler<Request, Response>;
};
type LazyEventHandler = () => EventHandler | Promise<EventHandler>;

/**
 * H3 Runtime Error
 * @class
 * @extends Error
 * @property {number} statusCode - An integer indicating the HTTP response status code.
 * @property {string} statusMessage - A string representing the HTTP status message.
 * @property {boolean} fatal - Indicates if the error is a fatal error.
 * @property {boolean} unhandled - Indicates if the error was unhandled and auto captured.
 * @property {DataT} data - An extra data that will be included in the response.
 *                         This can be used to pass additional information about the error.
 * @property {boolean} internal - Setting this property to `true` will mark the error as an internal error.
 */
declare class H3Error<DataT = unknown> extends Error {
    static __h3_error__: boolean;
    statusCode: number;
    fatal: boolean;
    unhandled: boolean;
    statusMessage?: string;
    data?: DataT;
    cause?: unknown;
    constructor(message: string, opts?: {
        cause?: unknown;
    });
    toJSON(): Pick<H3Error<DataT>, "data" | "statusCode" | "statusMessage" | "message">;
}
/**
 * Creates a new `Error` that can be used to handle both internal and runtime errors.
 *
 * @param input {string | (Partial<H3Error> & { status?: number; statusText?: string })} - The error message or an object containing error properties.
 * If a string is provided, it will be used as the error `message`.
 *
 * @example
 * // String error where `statusCode` defaults to `500`
 * throw createError("An error occurred");
 * // Object error
 * throw createError({
 *   statusCode: 400,
 *   statusMessage: "Bad Request",
 *   message: "Invalid input",
 *   data: { field: "email" }
 * });
 *
 *
 * @return {H3Error} - An instance of H3Error.
 *
 * @remarks
 * - Typically, `message` contains a brief, human-readable description of the error, while `statusMessage` is specific to HTTP responses and describes
 * the status text related to the response status code.
 * - In a client-server context, using a short `statusMessage` is recommended because it can be accessed on the client side. Otherwise, a `message`
 * passed to `createError` on the server will not propagate to the client.
 * - Consider avoiding putting dynamic user input in the `message` to prevent potential security issues.
 */
declare function createError<DataT = unknown>(input: string | (Partial<H3Error<DataT>> & {
    status?: number;
    statusText?: string;
})): H3Error<DataT>;
/**
 * Receives an error and returns the corresponding response.
 * H3 internally uses this function to handle unhandled errors.
 * Note that calling this function will close the connection and no other data will be sent to the client afterwards.
 *
 * @param event {H3Event} - H3 event or req passed by h3 handler.
 * @param error {Error | H3Error} - The raised error.
 * @param debug {boolean} - Whether the application is in debug mode.
 * In the debug mode, the stack trace of errors will be returned in the response.
 */
declare function sendError(event: H3Event, error: Error | H3Error, debug?: boolean): void;
/**
 * Checks if the given input is an instance of H3Error.
 *
 * @param input {*} - The input to check.
 * @return {boolean} - Returns true if the input is an instance of H3Error, false otherwise.
 */
declare function isError<DataT = unknown>(input: any): input is H3Error<DataT>;

interface Layer {
    route: string;
    match?: Matcher;
    handler: EventHandler;
}
type Stack = Layer[];
interface InputLayer {
    route?: string;
    match?: Matcher;
    handler: EventHandler;
    lazy?: boolean;
}
type InputStack = InputLayer[];
type Matcher = (url: string, event?: H3Event) => boolean;
interface AppUse {
    (route: string | string[], handler: EventHandler | EventHandler[], options?: Partial<InputLayer>): App;
    (handler: EventHandler | EventHandler[], options?: Partial<InputLayer>): App;
    (options: InputLayer): App;
}
type WebSocketOptions = AdapterOptions;
interface AppOptions {
    debug?: boolean;
    onError?: (error: H3Error, event: H3Event) => any;
    onRequest?: (event: H3Event) => void | Promise<void>;
    onBeforeResponse?: (event: H3Event, response: {
        body?: unknown;
    }) => void | Promise<void>;
    onAfterResponse?: (event: H3Event, response?: {
        body?: unknown;
    }) => void | Promise<void>;
    websocket?: WebSocketOptions;
}
interface App {
    stack: Stack;
    handler: EventHandler;
    options: AppOptions;
    use: AppUse;
    resolve: EventHandlerResolver;
    readonly websocket: WebSocketOptions;
}
/**
 * Create a new H3 app instance.
 */
declare function createApp(options?: AppOptions): App;
declare function use(app: App, arg1: string | EventHandler | InputLayer | InputLayer[], arg2?: Partial<InputLayer> | EventHandler | EventHandler[], arg3?: Partial<InputLayer>): App;
declare function createAppEventHandler(stack: Stack, options: AppOptions): EventHandler<EventHandlerRequest, Promise<void>>;

/**
 * Prefixes and executes a handler with a base path.
 *
 * @example
 * const app = createApp();
 * const router = createRouter();
 *
 * const apiRouter = createRouter().get(
 *   "/hello",
 *   defineEventHandler((event) => {
 *     return "Hello API!";
 *   }),
 * );
 *
 * router.use("/api/**", useBase("/api", apiRouter.handler));
 *
 * app.use(router.handler);
 *
 * @param base The base path to prefix. When set to an empty string, the handler will be run as is.
 * @param handler The event handler to use with the adapted path.
 */
declare function useBase(base: string, handler: EventHandler): EventHandler;

interface MultiPartData {
    data: Buffer;
    name?: string;
    filename?: string;
    type?: string;
}

/**
 * Reads body of the request and returns encoded raw string (default), or `Buffer` if encoding is falsy.
 *
 * @example
 * export default defineEventHandler(async (event) => {
 *   const body = await readRawBody(event, "utf-8");
 * });
 *
 * @param event {H3Event} H3 event or req passed by h3 handler
 * @param encoding {Encoding} encoding="utf-8" - The character encoding to use.
 *
 * @return {String|Buffer} Encoded raw string or raw Buffer of the body
 */
declare function readRawBody<E extends Encoding = "utf8">(event: H3Event, encoding?: E): E extends false ? Promise<Buffer | undefined> : Promise<string | undefined>;
/**
 * Reads request body and tries to safely parse using [destr](https://github.com/unjs/destr).
 *
 * @example
 * export default defineEventHandler(async (event) => {
 *   const body = await readBody(event);
 * });
 *
 * @param event H3 event passed by h3 handler
 * @param encoding The character encoding to use, defaults to 'utf-8'.
 *
 * @return {*} The `Object`, `Array`, `String`, `Number`, `Boolean`, or `null` value corresponding to the request JSON body
 */
declare function readBody<T, Event extends H3Event = H3Event, _T = InferEventInput<"body", Event, T>>(event: Event, options?: {
    strict?: boolean;
}): Promise<_T>;
/**
 * Tries to read the request body via `readBody`, then uses the provided validation function and either throws a validation error or returns the result.
 *
 * You can use a simple function to validate the body or use a library like `zod` to define a schema.
 *
 * @example
 * export default defineEventHandler(async (event) => {
 *   const body = await readValidatedBody(event, (body) => {
 *     return typeof body === "object" && body !== null;
 *   });
 * });
 * @example
 * import { z } from "zod";
 *
 * export default defineEventHandler(async (event) => {
 *   const objectSchema = z.object();
 *   const body = await readValidatedBody(event, objectSchema.safeParse);
 * });
 *
 * @param event The H3Event passed by the handler.
 * @param validate The function to use for body validation. It will be called passing the read request body. If the result is not false, the parsed body will be returned.
 * @throws If the validation function returns `false` or throws, a validation error will be thrown.
 * @return {*} The `Object`, `Array`, `String`, `Number`, `Boolean`, or `null` value corresponding to the request JSON body.
 * @see {readBody}
 */
declare function readValidatedBody<T, Event extends H3Event = H3Event, _T = InferEventInput<"body", Event, T>>(event: Event, validate: ValidateFunction<_T>): Promise<_T>;
/**
 * Tries to read and parse the body of a an H3Event as multipart form.
 *
 * @example
 * export default defineEventHandler(async (event) => {
 *   const formData = await readMultipartFormData(event);
 *   // The result could look like:
 *   // [
 *   //   {
 *   //     "data": "other",
 *   //     "name": "baz",
 *   //   },
 *   //   {
 *   //     "data": "something",
 *   //     "name": "some-other-data",
 *   //   },
 *   // ];
 * });
 *
 * @param event The H3Event object to read multipart form from.
 *
 * @return The parsed form data. If no form could be detected because the content type is not multipart/form-data or no boundary could be found.
 */
declare function readMultipartFormData(event: H3Event): Promise<MultiPartData[] | undefined>;
/**
 * Constructs a FormData object from an event, after converting it to a a web request.
 *
 * @example
 * export default defineEventHandler(async (event) => {
 *   const formData = await readFormData(event);
 *   const email = formData.get("email");
 *   const password = formData.get("password");
 * });
 *
 * @param event The H3Event object to read the form data from.
 */
declare function readFormData(event: H3Event): Promise<FormData>;
/**
 * Captures a stream from a request.
 * @param event The H3Event object containing the request information.
 * @returns Undefined if the request can't transport a payload, otherwise a ReadableStream of the request body.
 */
declare function getRequestWebStream(event: H3Event): undefined | ReadableStream;

interface CacheConditions {
    modifiedTime?: string | Date;
    maxAge?: number;
    etag?: string;
    cacheControls?: string[];
}
/**
 * Check request caching headers (`If-Modified-Since`) and add caching headers (Last-Modified, Cache-Control)
 * Note: `public` cache control will be added by default
 * @returns `true` when cache headers are matching. When `true` is returned, no response should be sent anymore
 */
declare function handleCacheHeaders(event: H3Event, opts: CacheConditions): boolean;

declare const MIMES: {
    readonly html: "text/html";
    readonly json: "application/json";
};

interface H3CorsOptions {
    origin?: "*" | "null" | (string | RegExp)[] | ((origin: string) => boolean);
    methods?: "*" | HTTPMethod[];
    allowHeaders?: "*" | string[];
    exposeHeaders?: "*" | string[];
    credentials?: boolean;
    maxAge?: string | false;
    preflight?: {
        statusCode?: number;
    };
}

/**
 * Handle CORS for the incoming request.
 *
 * If the incoming request is a CORS preflight request, it will append the CORS preflight headers and send a 204 response.
 *
 * If return value is `true`, the request is handled and no further action is needed.
 *
 * @example
 * const app = createApp();
 * const router = createRouter();
 * router.use('/',
 *   defineEventHandler(async (event) => {
 *       const didHandleCors = handleCors(event, {
 *         origin: '*',
 *         preflight: {
 *          statusCode: 204,
 *         },
 *      methods: '*',
 *    });
 *    if (didHandleCors) {
 *      return;
 *    }
 *    // Your code here
 *  })
 * );
 */
declare function handleCors(event: H3Event, options: H3CorsOptions): boolean;

/**
 * Get query the params object from the request URL parsed with [unjs/ufo](https://ufo.unjs.io).
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const query = getQuery(event); // { key: "value", key2: ["value1", "value2"] }
 * });
 */
declare function getQuery<T, Event extends H3Event = H3Event, _T = Exclude<InferEventInput<"query", Event, T>, undefined>>(event: Event): _T;
/**
 * Get the query param from the request URL parsed with [unjs/ufo](https://ufo.unjs.io) and validated with validate function.
 *
 * You can use a simple function to validate the query object or a library like `zod` to define a schema.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const query = getValidatedQuery(event, (data) => {
 *     return "key" in data && typeof data.key === "string";
 *   });
 * });
 * @example
 * import { z } from "zod";
 *
 * export default defineEventHandler((event) => {
 *   const query = getValidatedQuery(
 *     event,
 *     z.object({
 *       key: z.string(),
 *     }),
 *   );
 * });
 */
declare function getValidatedQuery<T, Event extends H3Event = H3Event, _T = InferEventInput<"query", Event, T>>(event: Event, validate: ValidateFunction<_T>): Promise<_T>;
/**
 * Get matched route params.
 *
 * If `decode` option is `true`, it will decode the matched route params using `decodeURI`.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const params = getRouterParams(event); // { key: "value" }
 * });
 */
declare function getRouterParams(event: H3Event, opts?: {
    decode?: boolean;
}): NonNullable<H3Event["context"]["params"]>;
/**
 * Get matched route params and validate with validate function.
 *
 * If `decode` option is `true`, it will decode the matched route params using `decodeURI`.
 *
 * You can use a simple function to validate the params object or a library like `zod` to define a schema.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const params = getValidatedRouterParams(event, (data) => {
 *     return "key" in data && typeof data.key === "string";
 *   });
 * });
 * @example
 * import { z } from "zod";
 *
 * export default defineEventHandler((event) => {
 *   const params = getValidatedRouterParams(
 *     event,
 *     z.object({
 *       key: z.string(),
 *     }),
 *   );
 * });
 */
declare function getValidatedRouterParams<T, Event extends H3Event = H3Event, _T = InferEventInput<"routerParams", Event, T>>(event: Event, validate: ValidateFunction<_T>, opts?: {
    decode?: boolean;
}): Promise<_T>;
/**
 * Get a matched route param by name.
 *
 * If `decode` option is `true`, it will decode the matched route param using `decodeURI`.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const param = getRouterParam(event, "key");
 * });
 */
declare function getRouterParam(event: H3Event, name: string, opts?: {
    decode?: boolean;
}): string | undefined;
/**
 * @deprecated Directly use `event.method` instead.
 */
declare function getMethod(event: H3Event, defaultMethod?: HTTPMethod): HTTPMethod;
/**
 *
 * Checks if the incoming request method is of the expected type.
 *
 * If `allowHead` is `true`, it will allow `HEAD` requests to pass if the expected method is `GET`.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   if (isMethod(event, "GET")) {
 *     // Handle GET request
 *   } else if (isMethod(event, ["POST", "PUT"])) {
 *     // Handle POST or PUT request
 *   }
 * });
 */
declare function isMethod(event: H3Event, expected: HTTPMethod | HTTPMethod[], allowHead?: boolean): boolean;
/**
 * Asserts that the incoming request method is of the expected type using `isMethod`.
 *
 * If the method is not allowed, it will throw a 405 error with the message "HTTP method is not allowed".
 *
 * If `allowHead` is `true`, it will allow `HEAD` requests to pass if the expected method is `GET`.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   assertMethod(event, "GET");
 *   // Handle GET request, otherwise throw 405 error
 * });
 */
declare function assertMethod(event: H3Event, expected: HTTPMethod | HTTPMethod[], allowHead?: boolean): void;
/**
 * Get the request headers object.
 *
 * Array headers are joined with a comma.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const headers = getRequestHeaders(event); // { "content-type": "application/json", "x-custom-header": "value" }
 * });
 */
declare function getRequestHeaders(event: H3Event): RequestHeaders;
/**
 * Alias for `getRequestHeaders`.
 */
declare const getHeaders: typeof getRequestHeaders;
/**
 * Get a request header by name.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const contentType = getRequestHeader(event, "content-type"); // "application/json"
 * });
 */
declare function getRequestHeader(event: H3Event, name: HTTPHeaderName): RequestHeaders[string];
/**
 * Alias for `getRequestHeader`.
 */
declare const getHeader: typeof getRequestHeader;
/**
 * Get the request hostname.
 *
 * If `xForwardedHost` is `true`, it will use the `x-forwarded-host` header if it exists.
 *
 * If no host header is found, it will default to "localhost".
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const host = getRequestHost(event); // "example.com"
 * });
 */
declare function getRequestHost(event: H3Event, opts?: {
    xForwardedHost?: boolean;
}): string;
/**
 * Get the request protocol.
 *
 * If `x-forwarded-proto` header is set to "https", it will return "https". You can disable this behavior by setting `xForwardedProto` to `false`.
 *
 * If protocol cannot be determined, it will default to "http".
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const protocol = getRequestProtocol(event); // "https"
 * });
 */
declare function getRequestProtocol(event: H3Event, opts?: {
    xForwardedProto?: boolean;
}): "https" | "http";
/** @deprecated Use `event.path` instead */
declare function getRequestPath(event: H3Event): string;
/**
 * Generated the full incoming request URL using `getRequestProtocol`, `getRequestHost` and `event.path`.
 *
 * If `xForwardedHost` is `true`, it will use the `x-forwarded-host` header if it exists.
 *
 * If `xForwardedProto` is `false`, it will not use the `x-forwarded-proto` header.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const url = getRequestURL(event); // "https://example.com/path"
 * });
 */
declare function getRequestURL(event: H3Event, opts?: {
    xForwardedHost?: boolean;
    xForwardedProto?: boolean;
}): URL;
/**
 * Convert the H3Event to a WebRequest object.
 *
 * **NOTE:** This function is not stable and might have edge cases that are not handled properly.
 */
declare function toWebRequest(event: H3Event): Request;
/**
 * Try to get the client IP address from the incoming request.
 *
 * If `xForwardedFor` is `true`, it will use the `x-forwarded-for` header if it exists.
 *
 * If IP cannot be determined, it will default to `undefined`.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const ip = getRequestIP(event); // "192.0.2.0"
 * });
 */
declare function getRequestIP(event: H3Event, opts?: {
    /**
     * Use the X-Forwarded-For HTTP header set by proxies.
     *
     * Note: Make sure that this header can be trusted (your application running behind a CDN or reverse proxy) before enabling.
     */
    xForwardedFor?: boolean;
}): string | undefined;

/**
 * Check if the incoming request is a CORS preflight request.
 */
declare function isPreflightRequest(event: H3Event): boolean;
/**
 * Check if the incoming request is a CORS request.
 */
declare function isCorsOriginAllowed(origin: ReturnType<typeof getRequestHeaders>["origin"], options: H3CorsOptions): boolean;
/**
 * Append CORS preflight headers to the response.
 */
declare function appendCorsPreflightHeaders(event: H3Event, options: H3CorsOptions): void;
/**
 * Append CORS headers to the response.
 */
declare function appendCorsHeaders(event: H3Event, options: H3CorsOptions): void;

/**
 * Parse the request to get HTTP Cookie header string and returning an object of all cookie name-value pairs.
 * @param event {H3Event} H3 event or req passed by h3 handler
 * @returns Object of cookie name-value pairs
 * ```ts
 * const cookies = parseCookies(event)
 * ```
 */
declare function parseCookies(event: H3Event): Record<string, string>;
/**
 * Get a cookie value by name.
 * @param event {H3Event} H3 event or req passed by h3 handler
 * @param name Name of the cookie to get
 * @returns {*} Value of the cookie (String or undefined)
 * ```ts
 * const authorization = getCookie(request, 'Authorization')
 * ```
 */
declare function getCookie(event: H3Event, name: string): string | undefined;
/**
 * Set a cookie value by name.
 * @param event {H3Event} H3 event or res passed by h3 handler
 * @param name Name of the cookie to set
 * @param value Value of the cookie to set
 * @param serializeOptions {CookieSerializeOptions} Options for serializing the cookie
 * ```ts
 * setCookie(res, 'Authorization', '1234567')
 * ```
 */
declare function setCookie(event: H3Event, name: string, value: string, serializeOptions?: CookieSerializeOptions): void;
/**
 * Remove a cookie by name.
 * @param event {H3Event} H3 event or res passed by h3 handler
 * @param name Name of the cookie to delete
 * @param serializeOptions {CookieSerializeOptions} Cookie options
 * ```ts
 * deleteCookie(res, 'SessionId')
 * ```
 */
declare function deleteCookie(event: H3Event, name: string, serializeOptions?: CookieSerializeOptions): void;
/**
 * Set-Cookie header field-values are sometimes comma joined in one string.
 *
 * This splits them without choking on commas that are within a single set-cookie field-value, such as in the Expires portion.
 * This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
 * Node.js does this for every header _except_ set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
 * Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
 * Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
 * @source https://github.com/nfriedly/set-cookie-parser/blob/3eab8b7d5d12c8ed87832532861c1a35520cf5b3/lib/set-cookie.js#L144
 *
 * @internal
 */
declare function splitCookiesString(cookiesString: string | string[]): string[];

interface RequestFingerprintOptions {
    /** @default SHA-1 */
    hash?: false | "SHA-1";
    /** @default `true` */
    ip?: boolean;
    /** @default `false` */
    xForwardedFor?: boolean;
    /** @default `false` */
    method?: boolean;
    /** @default `false` */
    path?: boolean;
    /** @default `false` */
    userAgent?: boolean;
}
/**
 *
 * Get a unique fingerprint for the incoming request.
 *
 * @experimental Behavior of this utility might change in the future versions
 */
declare function getRequestFingerprint(event: H3Event, opts?: RequestFingerprintOptions): Promise<string | null>;

type Duplex = "half" | "full";
interface ProxyOptions {
    headers?: RequestHeaders | HeadersInit;
    fetchOptions?: RequestInit & {
        duplex?: Duplex;
    } & {
        ignoreResponseError?: boolean;
    };
    fetch?: typeof fetch;
    sendStream?: boolean;
    streamRequest?: boolean;
    cookieDomainRewrite?: string | Record<string, string>;
    cookiePathRewrite?: string | Record<string, string>;
    onResponse?: (event: H3Event, response: Response) => void;
}
/**
 * Proxy the incoming request to a target URL.
 */
declare function proxyRequest(event: H3Event, target: string, opts?: ProxyOptions): Promise<any>;
/**
 * Make a proxy request to a target URL and send the response back to the client.
 */
declare function sendProxy(event: H3Event, target: string, opts?: ProxyOptions): Promise<any>;
/**
 * Get the request headers object without headers known to cause issues when proxying.
 */
declare function getProxyRequestHeaders(event: H3Event): any;
/**
 * Make a fetch request with the event's context and headers.
 */
declare function fetchWithEvent<T = unknown, _R = any, F extends (req: RequestInfo | URL, opts?: any) => any = typeof fetch>(event: H3Event, req: RequestInfo | URL, init?: RequestInit & {
    context?: H3EventContext;
}, options?: {
    fetch: F;
}): unknown extends T ? ReturnType<F> : T;

type IterationSource<Val, Ret = Val> = Iterable<Val> | AsyncIterable<Val> | Iterator<Val, Ret | undefined> | AsyncIterator<Val, Ret | undefined> | (() => Iterator<Val, Ret | undefined> | AsyncIterator<Val, Ret | undefined>);
type SendableValue = string | Buffer | Uint8Array;
type IteratorSerializer<Value> = (value: Value) => SendableValue | undefined;

/**
 * Directly send a response to the client.
 *
 * **Note:** This function should be used only when you want to send a response directly without using the `h3` event.
 * Normally you can directly `return` a value inside event handlers.
 */
declare function send(event: H3Event, data?: any, type?: MimeType): Promise<void>;
/**
 * Respond with an empty payload.<br>
 *
 * Note that calling this function will close the connection and no other data can be sent to the client afterwards.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   return sendNoContent(event);
 * });
 * @example
 * export default defineEventHandler((event) => {
 *   sendNoContent(event); // Close the connection
 *   console.log("This will not be executed");
 * });
 *
 * @param event H3 event
 * @param code status code to be send. By default, it is `204 No Content`.
 */
declare function sendNoContent(event: H3Event, code?: StatusCode): void;
/**
 * Set the response status code and message.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   setResponseStatus(event, 404, "Not Found");
 *   return "Not Found";
 * });
 */
declare function setResponseStatus(event: H3Event, code?: StatusCode, text?: string): void;
/**
 * Get the current response status code.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const status = getResponseStatus(event);
 *   return `Status: ${status}`;
 * });
 */
declare function getResponseStatus(event: H3Event): number;
/**
 * Get the current response status message.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const statusText = getResponseStatusText(event);
 *   return `Status: ${statusText}`;
 * });
 */
declare function getResponseStatusText(event: H3Event): string;
/**
 * Set the response status code and message.
 */
declare function defaultContentType(event: H3Event, type?: MimeType): void;
/**
 * Send a redirect response to the client.
 *
 * It adds the `location` header to the response and sets the status code to 302 by default.
 *
 * In the body, it sends a simple HTML page with a meta refresh tag to redirect the client in case the headers are ignored.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   return sendRedirect(event, "https://example.com");
 * });
 *
 * @example
 * export default defineEventHandler((event) => {
 *   return sendRedirect(event, "https://example.com", 301); // Permanent redirect
 * });
 */
declare function sendRedirect(event: H3Event, location: string, code?: StatusCode): Promise<void>;
/**
 * Get the response headers object.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const headers = getResponseHeaders(event);
 * });
 */
declare function getResponseHeaders(event: H3Event): ReturnType<H3Event["node"]["res"]["getHeaders"]>;
/**
 * Alias for `getResponseHeaders`.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   const contentType = getResponseHeader(event, "content-type"); // Get the response content-type header
 * });
 */
declare function getResponseHeader(event: H3Event, name: HTTPHeaderName): ReturnType<H3Event["node"]["res"]["getHeader"]>;
/**
 * Set the response headers.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   setResponseHeaders(event, {
 *     "content-type": "text/html",
 *     "cache-control": "no-cache",
 *   });
 * });
 */
declare function setResponseHeaders(event: H3Event, headers: TypedHeaders): void;
/**
 * Alias for `setResponseHeaders`.
 */
declare const setHeaders: typeof setResponseHeaders;
/**
 * Set a response header by name.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   setResponseHeader(event, "content-type", "text/html");
 * });
 */
declare function setResponseHeader<T extends HTTPHeaderName>(event: H3Event, name: T, value: TypedHeaders[Lowercase<T>]): void;
/**
 * Alias for `setResponseHeader`.
 */
declare const setHeader: typeof setResponseHeader;
/**
 * Append the response headers.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   appendResponseHeaders(event, {
 *     "content-type": "text/html",
 *     "cache-control": "no-cache",
 *   });
 * });
 */
declare function appendResponseHeaders(event: H3Event, headers: TypedHeaders): void;
/**
 * Alias for `appendResponseHeaders`.
 */
declare const appendHeaders: typeof appendResponseHeaders;
/**
 * Append a response header by name.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   appendResponseHeader(event, "content-type", "text/html");
 * });
 */
declare function appendResponseHeader<T extends HTTPHeaderName>(event: H3Event, name: T, value: TypedHeaders[Lowercase<T>]): void;
/**
 * Alias for `appendResponseHeader`.
 */
declare const appendHeader: typeof appendResponseHeader;
/**
 * Remove all response headers, or only those specified in the headerNames array.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   clearResponseHeaders(event, ["content-type", "cache-control"]); // Remove content-type and cache-control headers
 * });
 *
 * @param event H3 event
 * @param headerNames Array of header names to remove
 */
declare function clearResponseHeaders(event: H3Event, headerNames?: HTTPHeaderName[]): void;
/**
 * Remove a response header by name.
 *
 * @example
 * export default defineEventHandler((event) => {
 *   removeResponseHeader(event, "content-type"); // Remove content-type header
 * });
 */
declare function removeResponseHeader(event: H3Event, name: HTTPHeaderName): void;
/**
 * Checks if the data is a stream. (Node.js Readable Stream, React Pipeable Stream, or Web Stream)
 */
declare function isStream(data: any): data is Readable | ReadableStream;
/**
 * Checks if the data is a Response object.
 */
declare function isWebResponse(data: any): data is Response;
/**
 * Send a stream response to the client.
 *
 * Note: You can directly `return` a stream value inside event handlers alternatively which is recommended.
 */
declare function sendStream(event: H3Event, stream: Readable | ReadableStream): Promise<void>;
/**
 * Write `HTTP/1.1 103 Early Hints` to the client.
 */
declare function writeEarlyHints(event: H3Event, hints: string | string[] | Record<string, string | string[]>, cb?: () => void): void;
/**
 * Send a Response object to the client.
 */
declare function sendWebResponse(event: H3Event, response: Response): void | Promise<void>;
/**
 * Iterate a source of chunks and send back each chunk in order.
 * Supports mixing async work together with emitting chunks.
 *
 * Each chunk must be a string or a buffer.
 *
 * For generator (yielding) functions, the returned value is treated the same as yielded values.
 *
 * @param event - H3 event
 * @param iterable - Iterator that produces chunks of the response.
 * @param serializer - Function that converts values from the iterable into stream-compatible values.
 * @template Value - Test
 *
 * @example
 * sendIterable(event, work());
 * async function* work() {
 *   // Open document body
 *   yield "<!DOCTYPE html>\n<html><body><h1>Executing...</h1><ol>\n";
 *   // Do work ...
 *   for (let i = 0; i < 1000) {
 *     await delay(1000);
 *     // Report progress
 *     yield `<li>Completed job #`;
 *     yield i;
 *     yield `</li>\n`;
 *   }
 *   // Close out the report
 *   return `</ol></body></html>`;
 * }
 * async function delay(ms) {
 *   return new Promise(resolve => setTimeout(resolve, ms));
 * }
 */
declare function sendIterable<Value = unknown, Return = unknown>(event: H3Event, iterable: IterationSource<Value, Return>, options?: {
    serializer: IteratorSerializer<Value | Return>;
}): Promise<void>;

/**
 * Make sure the status message is safe to use in a response.
 *
 * Allowed characters: horizontal tabs, spaces or visible ascii characters: https://www.rfc-editor.org/rfc/rfc7230#section-3.1.2
 */
declare function sanitizeStatusMessage(statusMessage?: string): string;
/**
 * Make sure the status code is a valid HTTP status code.
 */
declare function sanitizeStatusCode(statusCode?: string | number, defaultStatusCode?: number): number;

interface EventStreamOptions {
    /**
     * Automatically close the writable stream when the request is closed
     *
     * Default is `true`
     */
    autoclose?: boolean;
}
/**
 * See https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#fields
 */
interface EventStreamMessage {
    id?: string;
    event?: string;
    retry?: number;
    data: string;
}

/**
 * A helper class for [server sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format)
 */
declare class EventStream$1 {
    private readonly _h3Event;
    private readonly _transformStream;
    private readonly _writer;
    private readonly _encoder;
    private _writerIsClosed;
    private _paused;
    private _unsentData;
    private _disposed;
    private _handled;
    constructor(event: H3Event, opts?: EventStreamOptions);
    /**
     * Publish new event(s) for the client
     */
    push(message: string): Promise<void>;
    push(message: string[]): Promise<void>;
    push(message: EventStreamMessage): Promise<void>;
    push(message: EventStreamMessage[]): Promise<void>;
    private _sendEvent;
    private _sendEvents;
    pause(): void;
    get isPaused(): boolean;
    resume(): Promise<void>;
    flush(): Promise<void>;
    /**
     * Close the stream and the connection if the stream is being sent to the client
     */
    close(): Promise<void>;
    /**
     * Triggers callback when the writable stream is closed.
     * It is also triggered after calling the `close()` method.
     */
    onClosed(cb: () => any): void;
    send(): Promise<void>;
}

/**
 * Initialize an EventStream instance for creating [server sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
 *
 * @experimental This function is experimental and might be unstable in some environments.
 *
 * @example
 *
 * ```ts
 * import { createEventStream, sendEventStream } from "h3";
 *
 * eventHandler((event) => {
 *   const eventStream = createEventStream(event);
 *
 *   // Send a message every second
 *   const interval = setInterval(async () => {
 *     await eventStream.push("Hello world");
 *   }, 1000);
 *
 *   // cleanup the interval and close the stream when the connection is terminated
 *   eventStream.onClosed(async () => {
 *     console.log("closing SSE...");
 *     clearInterval(interval);
 *     await eventStream.close();
 *   });
 *
 *   return eventStream.send();
 * });
 * ```
 */
declare function createEventStream(event: H3Event, opts?: EventStreamOptions): EventStream$1;
type EventStream = ReturnType<typeof createEventStream>;

interface StaticAssetMeta {
    type?: string;
    etag?: string;
    mtime?: number | string | Date;
    path?: string;
    size?: number;
    encoding?: string;
}
interface ServeStaticOptions {
    /**
     * This function should resolve asset meta
     */
    getMeta: (id: string) => StaticAssetMeta | undefined | Promise<StaticAssetMeta | undefined>;
    /**
     * This function should resolve asset content
     */
    getContents: (id: string) => unknown | Promise<unknown>;
    /**
     * Map of supported encodings (compressions) and their file extensions.
     *
     * Each extension will be appended to the asset path to find the compressed version of the asset.
     *
     * @example { gzip: ".gz", br: ".br" }
     */
    encodings?: Record<string, string>;
    /**
     * Default index file to serve when the path is a directory
     *
     * @default ["/index.html"]
     */
    indexNames?: string[];
    /**
     * When set to true, the function will not throw 404 error when the asset meta is not found or meta validation failed
     */
    fallthrough?: boolean;
}
/**
 * Dynamically serve static assets based on the request path.
 */
declare function serveStatic(event: H3Event, options: ServeStaticOptions): Promise<void | false>;

/**
 * Define WebSocket hooks.
 *
 * @see https://h3.unjs.io/guide/websocket
 */
declare function defineWebSocket(hooks: Partial<Hooks>): Partial<Hooks>;
/**
 * Define WebSocket event handler.
 *
 * @see https://h3.unjs.io/guide/websocket
 */
declare function defineWebSocketHandler(hooks: Partial<Hooks>): EventHandler<EventHandlerRequest, never>;

/** @experimental */
type WebHandler = (request: Request, context?: Record<string, unknown>) => Promise<Response>;
/** @experimental */
declare function toWebHandler(app: App): WebHandler;
/** @experimental */
declare function fromWebHandler(handler: WebHandler): EventHandler<EventHandlerRequest, Promise<Response>>;

interface PlainRequest {
    _eventOverrides?: Partial<H3Event>;
    context?: Record<string, unknown>;
    method: string;
    path: string;
    headers: HeadersInit;
    body?: null | BodyInit;
}
interface PlainResponse {
    status: number;
    statusText: string;
    headers: [string, string][];
    body?: unknown;
}
type PlainHandler = (request: PlainRequest) => Promise<PlainResponse>;
/** @experimental */
declare function toPlainHandler(app: App): PlainHandler;
/** @experimental */
declare function fromPlainHandler(handler: PlainHandler): EventHandler<EventHandlerRequest, Promise<unknown>>;

export { type AddRouteShortcuts, type App, type AppOptions, type AppUse, type CacheConditions, type CreateRouterOptions, type Duplex, type DynamicEventHandler, type Encoding, type EventHandler, type EventHandlerObject, type EventHandlerRequest, type EventHandlerResolver, type EventHandlerResponse, type EventStream, type EventStreamMessage, type EventStreamOptions, type H3CorsOptions, H3Error, H3Event, type H3EventContext, H3Headers, H3Response, type HTTPHeaderName, type HTTPMethod, type InferEventInput, type InputLayer, type InputStack, type Layer, type LazyEventHandler, MIMES, type Matcher, type MimeType, type MultiPartData, type NodeEventContext, type NodeListener, type NodeMiddleware, type NodePromisifiedHandler, type PlainHandler, type PlainRequest, type PlainResponse, type ProxyOptions, type RequestFingerprintOptions, type RequestHeaders, type RouteNode, type Router, type RouterMethod, type RouterUse, type ServeStaticOptions, type Session, type SessionConfig, type SessionData, type Stack, type StaticAssetMeta, type StatusCode, type TypedHeaders, type ValidateFunction, type ValidateResult, type WebEventContext, type WebHandler, type WebSocketOptions, type _RequestMiddleware, type _ResponseMiddleware, appendCorsHeaders, appendCorsPreflightHeaders, appendHeader, appendHeaders, appendResponseHeader, appendResponseHeaders, assertMethod, callNodeListener, clearResponseHeaders, clearSession, createApp, createAppEventHandler, createError, createEvent, createEventStream, createRouter, defaultContentType, defineEventHandler, defineLazyEventHandler, defineNodeListener, defineNodeMiddleware, defineRequestMiddleware, defineResponseMiddleware, defineWebSocket, defineWebSocketHandler, deleteCookie, dynamicEventHandler, eventHandler, fetchWithEvent, fromNodeMiddleware, fromPlainHandler, fromWebHandler, getCookie, getHeader, getHeaders, getMethod, getProxyRequestHeaders, getQuery, getRequestFingerprint, getRequestHeader, getRequestHeaders, getRequestHost, getRequestIP, getRequestPath, getRequestProtocol, getRequestURL, getRequestWebStream, getResponseHeader, getResponseHeaders, getResponseStatus, getResponseStatusText, getRouterParam, getRouterParams, getSession, getValidatedQuery, getValidatedRouterParams, handleCacheHeaders, handleCors, isCorsOriginAllowed, isError, isEvent, isEventHandler, isMethod, isPreflightRequest, isStream, isWebResponse, lazyEventHandler, parseCookies, promisifyNodeListener, proxyRequest, readBody, readFormData, readMultipartFormData, readRawBody, readValidatedBody, removeResponseHeader, sanitizeStatusCode, sanitizeStatusMessage, sealSession, send, sendError, sendIterable, sendNoContent, sendProxy, sendRedirect, sendStream, sendWebResponse, serveStatic, setCookie, setHeader, setHeaders, setResponseHeader, setResponseHeaders, setResponseStatus, splitCookiesString, toEventHandler, toNodeListener, toPlainHandler, toWebHandler, toWebRequest, unsealSession, updateSession, use, useBase, useSession, writeEarlyHints };
