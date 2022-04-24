import groovy.json.JsonSlurper
import groovy.json.JsonOutput
import org.apache.jmeter.services.FileServer
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.ConcurrentHashMap

class JsonSampleHolder {
	static samples = 
		MapWithDefault.newInstance(
			new ConcurrentHashMap<String, JsonSample>(), { String f -> new JsonSample(f) }
		)

	static def next(file) {
		return samples.get(file).next()
	}
}

class JsonSample {
  def data = null
  def ite = null

  JsonSample(file) {
	  if(data == null) {
	  	def inputPath = FileServer.getFileServer().getBaseDir() + file
		File inputFile = new File(inputPath)
		def slurper = new JsonSlurper()
		data = new ConcurrentLinkedQueue(slurper.parse(inputFile))
		ite = data.iterator()
	  }
  }
  synchronized def next() {
	if(!ite.hasNext()) {
		ite = data.iterator()
	}
	return ite.next()
  }
}


Thread thread = Thread.currentThread();
Long threadNum = thread.getId();
def value = JsonSampleHolder.next(args[0])
def json = JsonOutput.toJson(value)
log.info(threadNum + " : " + value)
vars.putObject(args[1], value)
vars.put(args[1] + "_json", json)

if(binding.hasVariable('SampleResult')) {
	SampleResult.setContentType("application/json")
	SampleResult.setResponseCodeOK()
	SampleResult.setResponseData(json, "utf-8")
}
