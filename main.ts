import { Construct } from "constructs";
import { App, Chart, ChartProps } from "cdk8s";

import { KubeService, IntOrString, KubeDeployment } from "./imports/k8s";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    // define resources here

    //Create Label
    const label = { app: "hello-k8s" };

    //Create Service
    new KubeService(this, "service", {
      spec: {
        type: "LoadBalancer",
        ports: [
          {
            port: 80,
            targetPort: IntOrString.fromNumber(8080),
          },
        ],
        selector: label,
      },
    });

    //Create Deployment
    new KubeDeployment(this, "deployment", {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label,
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: "hello-kubernetes",
                image: "paulbouwer/hello-kubernetes:1.8",
                ports: [{ containerPort: 8080 }],
                env: [
                  {
                    name: "MESSAGE",
                    value:
                      "I just deployed this on AWS EKS using CDK for Kubernetes",
                  },
                ],
              },
            ],
          },
        },
      },
    });
  }
}

const app = new App();
new MyChart(app, "aws-cdk8s-demo");
app.synth();
