// Parses the repository plan without running it, then samples only a local fixture.
import java.io.File;
import org.apache.jmeter.util.JMeterUtils;
import org.apache.jmeter.save.SaveService;
import org.apache.jorphan.collections.HashTree;
class ValidatePlan {
  public static void main(String[] args) throws Exception {
    JMeterUtils.setJMeterHome(args[0]);
    JMeterUtils.loadJMeterProperties(args[0] + "/bin/jmeter.properties");
    JMeterUtils.initLocale();
    SaveService.loadProperties();
    HashTree plan = SaveService.loadTree(new File(args[1]));
    if (plan.isEmpty()) throw new IllegalStateException("Empty test plan");
    System.out.println("Plan parsed successfully without executing its samplers");
    var fixture = com.sun.net.httpserver.HttpServer.create(new java.net.InetSocketAddress("127.0.0.1", 0), 0);
    fixture.createContext("/fixture", exchange -> {
      byte[] body = "{\"fixture\":true}".getBytes(java.nio.charset.StandardCharsets.UTF_8);
      exchange.sendResponseHeaders(200, body.length);
      exchange.getResponseBody().write(body);
      exchange.close();
    });
    fixture.start();
    try {
      var sampler = new org.apache.jmeter.protocol.http.sampler.HTTPSamplerProxy();
      sampler.setDomain("127.0.0.1");
      sampler.setPort(fixture.getAddress().getPort());
      sampler.setProtocol("http");
      sampler.setPath("/fixture");
      sampler.setMethod("GET");
      sampler.setImplementation("HttpClient4");
      var result = sampler.sample();
      if (!"200".equals(result.getResponseCode()) || !result.getResponseDataAsString().contains("fixture")) {
        throw new IllegalStateException(result.getResponseMessage() + " " + result.getResponseDataAsString());
      }
      sampler.threadFinished();
      System.out.println("Isolated HTTP sampler fixture passed");
    } finally { fixture.stop(0); }
  }
}
