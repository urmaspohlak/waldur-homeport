import template from './security-group-rule-editor.html';

const CIDR_RE = '^(\\d{1,3}\\.){0,3}\\d{1,3}/\\d{1,2}$';

const PROTOCOLS = ['tcp', 'udp', 'icmp'];

export const securityGroupRuleEditor = {
  template,
  bindings: {
    model: '<',
    field: '<',
  },
  controller: class securityGroupRuleEditorController {
    $onInit() {
      this.protocols = PROTOCOLS;
      if (!this.model[this.field.name]) {
        this.model[this.field.name] = [];
      }
      this.target = this.model[this.field.name];
      this.cidrPattern = CIDR_RE;
    }

    getPortMin(rule) {
      if (rule.protocol === 'icmp') {
        return -1;
      } else {
        return 1;
      }
    }

    getPortMax(rule) {
      if (rule.protocol === 'icmp') {
        return 255;
      } else {
        return 65535;
      }
    }

    addRule() {
      this.target.push({
        protocol: PROTOCOLS[0]
      });
    }

    deleteRule(rule) {
      const index = this.target.indexOf(rule);
      if (index !== -1) {
        this.target.splice(index, 1);
      }
    }
  }
};
