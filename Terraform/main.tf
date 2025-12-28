locals {
  services = ["order-service", "payment-service"]
}

module "sqs" {
  count    = length(local.services)
  source   = "./modules/sqs"
  env      = var.env
  sqs_name = local.services[count.index]
  sns_arn  = module.sns.sns_arn
}

module "sns" {
  source   = "./modules/sns"
  sns_name = var.sns_name
  env      = var.env
}
