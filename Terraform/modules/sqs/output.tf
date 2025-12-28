output "sqs_arn" {
  value = aws_sqs_queue.this_queue[*].arn
}
